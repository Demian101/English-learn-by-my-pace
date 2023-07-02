import { NextFunction, Request, Response } from "express";
// import { List } from "reselect/es/types";
import Sentence, { ISent } from "../models/Sentence";
import { ttsGenerate } from "../utils/ttsGenerate";
import { removeUnicode } from "../utils/removeUnicode";
import Word from "../models/Word";
const stringSimilarity = require("string-similarity");
const fs = require('fs');
const audioconcat = require('audioconcat')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

// 1. Append Sentence
// 2. modify Sentence
// 3. Query Sentence By Cognition and his main Words
// 4. Caculate similarity with user input
// 5. Get 10 lowest sentences.
// 6. return sound file
// 7. query a sentence.
// 8. concat multiple audio files using ffmpeg


/* const post: IPost = new Post({
  user: req.user._id,
  username: req.user.username,
  avatar: req.user.avatar,
  text: req.body.text,
  createdAt: Date.now(),
  visibility: req.body.visibility,
});

const userById: any = await User.findById(req.user._id);
const newPost = await post.save();
userById.posts.push(post);
*/


// 1. Append Sentence
const addSentence = async ( req: Request, res: Response, next: NextFunction) => {
  console.log('Controller addSentence...');
  try {
    // word, rootOrAffix, soundmark, definition,  label, isInRankList, cognition,ex1,ex2,ex3
    const { en, zh, label, words, } = req.body;

    const sentenceExists = await Sentence.findOne({ en });  // findOne({ 'word': word });
    if (sentenceExists) { res.status(409).json({ message: "Exists! - This sentence already exists !!!!!" });} 
    else {
      const sent_: ISent = new Sentence({
        en, zh, label,
      });
      console.log('sent_ raw', sent_)
      /* 方法 1 ： 只添加 Word 的 _id , 后续 populate 出来。 */
      if(words?.length > 0){
        for (const word of words) {   // 注意：向
          console.log('word', word)
          const word_ = await Word.findOne({word})
          if(word_){
            sent_.words?.push(word_._id);
            word_.examples?.push(sent_._id)
            const savedWord_= await word_.save();
          } else {
            res.status(404).json({"message": "word doesn't exist yet, please add it"})
          }
        }
      }

      /* sound */
      const res_sound = await ttsGenerate(removeUnicode(en))
      if(!res_sound){ res.status(400).json({ "message": "check charset, like <0xa0> .. "}) }
      sent_.sound = res_sound?.filename
    
      const savedSent = await sent_.save();
      
      
      /* 方法 2 ： 直接将 Word 的 Object 体都添加进来：
      // words: ['preices', 'lonely']
      const promises: List<Promise<any>> = await words.map(async (word: any) => {
        return await Word.findOne({word});
      });
      const wordsList = await Promise.all(promises);  

      if (wordsList) {
        wordsList.forEach( (wordobj)=> {
          sent_?.words?.push(wordobj);
        })
      }    */

      if (savedSent){
        res.json( savedSent );
        // console.log('savedSent .............................. ', savedSent)
      }
    }
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
};


// 2. modify Sentence
// 得用 ID，，， 不能用 en
const editSentence = async ( req: Request, res: Response, next: NextFunction) => {
  console.log("Controller editSentence... ")
  try {
    let { en, zh, label, words } = req.body;   // 后面要赋值， 所以用 let

    console.log('words ---- ' , words)
    let wordIdList: any = [];
    for( const word of words){  // 是 of ！！ 不是 in ！！
      console.log('word ---- ' , word)
      const wordObj =  await Word.findOne({word});
      console.log('wordObj ', wordObj, wordObj?._id)
      if(wordObj) { wordIdList.push(wordObj._id) }
    }
    setTimeout(()=>{
      console.log('wordIdList ...... ', wordIdList)
    },2000)

    // update user info
    const editedSent:any =  await Sentence.findOneAndUpdate({_id:req.params.id}, {
      $set: {
        en: en,
        zh: zh,
        label: label,
        words: wordIdList,
      }
    }, {new: true});
    res.status(200).json(editedSent);
  }
  catch(err){
    res.json(err)
    // res.status(500).json({ message: "Error while trying to edit user" })
  }
}


// 5. 获取认知度排名最低的 N 个 句子。  Get 10 lowest sentences.
const getCognitionTopN = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Controller getCognitionTopN...');
  try {
    const SentFields = 'idc.cognition en zh label sound words'
    const WordFields = 'word rootOrAffix label phrase soundmark definition examples'

    const wordsList: any = await Sentence.find()  // {isInRankList: true}
      .sort({'idc.cognition': 1})
      .select(SentFields)
      .populate('words', WordFields)  // 选择 derivation 里所需要的字段
      .limit(10);
    // if(topSentences) {console.log('topSentences.length ' , topSentences.length) }

    // const promises: List<Promise<any>> = await topSentences.map(async (sent_: any) => {
    //   console.log('sent_?._id', sent_?._id);
    //   const data: any = await Sentence.findOne({'_id': sent_?._id})
      
      
    // return data
    // return Word.findOne({ word: word_ });
    // });
    // const wordsList = await Promise.all(promises);  
    if (wordsList){ 
      console.log('wordsList', wordsList) 
      res.json(wordsList) 
    } else{ res.status(500).json({message: "Something went wrong"})  }
  }
  catch(err){ 
    res.json(err)
    //res.status(500).json({message: "Something went wrong"}) 
  }
}


// getAllSents 获取全部 Sentence 
const getAllSents = async (req: Request, res: Response, next: NextFunction) => {
  try{
    console.log('Controller getAllSents...');
    const sents = await Sentence.find()
      .sort({ createdAt: -1 })
    if(sents) {
      res.json(sents);
    }
  } catch(err){
     console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
};


// getOneSent 按 句子内容 获取该句子。
const getOneSent = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const name = req.params.id;  //   `/:id`  用 req.params
    console.log('getOneWordId req.params, name)', req.params, name)
    const sent_ = await Sentence.findOne({'en': name}) // {'word': word}

    const sent = await Sentence.findById(sent_?._id)
      // .select("-password")
      .populate("words");
    if (sent) { 
      res.json(sent); 
    }

  } catch(err){
    console.log(err)
    //res.status(500).json( {message: "Something went wrong"} )
  }
};



// const mapLoop = async (strs: string) => {
//   const arrStr = strs.split(",").map( (item) => item.trim());
//   const promises: List<Promise<any>> = await arrStr.map(async (word_) => {
//     return Word.findOne({ word: word_ });
//   });
//   const wordIds = await Promise.all(promises);  
//   return wordIds.map((item) => item?._id).filter(i => i) // 不能过早地调 ._id !!!
// };

// const addWordExtension = async ( req: Request, res: Response, next: NextFunction) => {
//   /* put 有 2 个部分，
//    *  1. 对 Extension 拓展信息的补充 'extension'
//    *  2. 对现有的单词的基础属性进行修改 'update'
//    */
//   console.log('Controller addWordExtension req.params.id', req.params.id );
//   const { fType, word, derivation, synonym, confusion, soundmark, definition, label, isInRankList } = req.body;   // confusionWord 

//   if (fType === 'extension') {
//     try {
//       const WordById: any = await Word.findOne({'word': req.params.id});   // process

//       if (!WordById) {       // if user exists
//         res.status(404).json({ message: "Word Does Not exists !!!!!" });
//       } else {
//         const derivationIdArr: any = await mapLoop(derivation);
//         const synonymIdArr: any = await mapLoop(synonym);
//         const confusionArr: any = await mapLoop(confusion);
//         console.log('derivationIdArr,synonymIdArr,confusionArr ', derivationIdArr, synonymIdArr, confusionArr)
        
//         for (let i = 0; i < derivationIdArr.length; i++) {
//           if (WordById?.derivation.includes(derivationIdArr[i])){
//             res.status(409).json({ message: "derivation already exists !!!!!"})
//           }
//           WordById?.derivation?.push(derivationIdArr[i])  // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
//         };

//         for (let i = 0; i < synonymIdArr.length; i++) {
//           if (WordById?.synonym.includes(synonymIdArr[i])){
//             res.status(409).json({ message: "synonym already exists !!!!!"})
//           }
//           WordById?.synonym?.push(synonymIdArr[i])  // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
//         };

//         for (let i = 0; i < confusionArr.length; i++) {
//           if (WordById?.confusion.includes(confusionArr[i])){
//             res.status(409).json({ message: "confusion already exists !!!!!"})
//           }
//           WordById?.confusion?.push(confusionArr[i])  // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
//         };

//         if (WordById) {
//           const pushedPost = await WordById.save();
//         }
//         res.json({
//           _id: WordById._id,
//           word: WordById.word,
//           derivation: WordById.derivation,
//           synonym: WordById.synonym,
//           confusion: WordById.confusion,
//         });
//       }
//     }
//     catch(err){
//       console.log("error: ------- ", err);
//       // res.status(500).json( {message: "Something went wrong"} )
//     }
//   }  /* if end*/
//   else if (fType === 'update') {  // 说明函数类型是 update 
//     const editedWord:any =  await Word.findOneAndUpdate({'word': req.params.id}, {
//       $set: {
//         word: word,
//         soundmark: soundmark,
//         definition: definition,
//         label: label,
//         isInRankList: isInRankList
//       }
//     }, {new: true});
//   }
// };

/*
const getWordById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wordId = req.params.id;
    // populate 用于填充关联的数据，这里是填充 user 对应的 posts （推文，一对多）
    const word = await Word.findById(wordId)
      // .select("-password")
      .populate("words");
    if (word) { res.json(word); }
  }
  catch(err) {
    res.status(404).json({ message: "Word not found" });
  }
}*/


const similarityCalculate = async ( req: Request, res: Response, next: NextFunction) => {
  console.log("Controller similarityCalculate... ", req.params.id)
  try {
    const sent_id = req.params.id;
    const { inputEng } = req.body;   // 后面要赋值， 所以用 let


    // let doc = Sentence.findByIdAndUpdate({_id: sent_id},
    //   {
    //     "idc": { "cognition": 3}
    //   },{ new: true, })
    // res.status(200).json(doc);

    // const sotredEng:any = await Sentence.findById(sent_id).lean().exec((err, data) => {
    //   console.log(inputEng, data?.en)
    //   const similarity = stringSimilarity.compareTwoStrings(inputEng, data?.en)
    //   console.log('similarity', similarity);
    //   if (data){
    //     data.idc.cognition = similarity
    //     console.log(' data.idc.cognition', data.idc.cognition)
    //   }
    // });
    
    // if(sotredEng){
    //   console.log(' sotredEng', sotredEng)
    //   res.status(200).json(sotredEng)
    // }
    // console.log(' sotredEng', sotredEng)

    const sotredEng = await Sentence.findById(sent_id);
    if(sotredEng){
      console.log(inputEng, sotredEng?.en)
      const similarity = stringSimilarity.compareTwoStrings(inputEng, sotredEng?.en)
      console.log('similarity', similarity)
      sotredEng.idc.cognition = similarity;
      sotredEng?.histInput?.push(inputEng);
    }
    const savedEng = sotredEng?.save();
    if(savedEng){
      res.status(200).json(sotredEng)
    }
  }
  catch(err) {
    console.log(err)
    // res.status(500).json( {message: "Something went wrong"} )
  }
};


const soundStream = async ( req: Request, res: Response, next: NextFunction) => {
  console.log('soundStream Controller.... ')
  try{
    const sentId = req.params.id;
    console.log("Current directory:", __dirname);

    // const soundPath = '/Users/soda/Repository/English-learn-by-my-pace/pythonTTS/voices/' + sentId + '.mp3';
    const soundPath = '../pythonTTS/voices/' + sentId + '.mp3';
    // console.log(fs.statSync(__dirname)) ;
    var stat = fs.statSync(soundPath);
    console.log('req.headers.range', req.headers.range)
    const range = req.headers.range;
    var readStream;

    if (range !== undefined) {
      var parts = range.replace(/bytes=/, "").split("-");

      var partial_start = parts[0];
      var partial_end = parts[1];

      var start = parseInt(partial_start, 10);
      var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
      var content_length = (end - start) + 1;

      res.status(206).header({
          'Content-Type': 'audio/mpeg',
          'Content-Length': content_length,
          'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
      });

      readStream = fs.createReadStream(soundPath, {start: start, end: end});
    } else {
      res.header({
          'Content-Type': 'audio/mpeg',
          'Content-Length': stat.size
      });
      readStream = fs.createReadStream(soundPath);
    }
    readStream.pipe(res);
  }
  catch(err){
    console.log(err)
    // res.status(500).json( {message: "Something went wrong"} )
  }
}

const concatAudios =  async ( req: Request, res: Response, next: NextFunction) => {
  console.log('concat Audios Controller.... ')
  try{

    const SentFields = 'idc.cognition en zh label sound words'
    const WordFields = 'word rootOrAffix label phrase soundmark definition examples'

    const senList: any = await Sentence.find()  // {isInRankList: true}
      .sort({'idc.cognition': 1})
      .select('sound')
      .limit(10);
    let sound_list: Array<string> = [];
    if(senList){
      senList.map((obj: any)=>{
        sound_list.push( '../pythonTTS/voices/' + obj?.sound)
        sound_list.push('../pythonTTS/concat/blank.mp3')     // 加一段空白过渡，要求：「和 Sentence 一致：单声道 mono，24K 采样频率，否则 concat 不成功」
      })
    }
    if(sound_list){
      console.log('sound_list', sound_list)
    }


    // var songs = [
    //   '../pythonTTS/voices/3f88b4be506efa993cea3bab91259e19.mp3',
    //   '../pythonTTS/voices/17acbd9865f874d42dc172d47c181df4.mp3',
    //   '../pythonTTS/voices/67c5d8482ac6f981442274572335a6ec.mp3',
    // ]

    let today = new Date()
    audioconcat(sound_list)
      .concat(`../pythonTTS/concat/${today.toISOString().split('T')[0]}.mp3`)  // -> '2022-10-31'
      .on('start', function (command: any) {
        console.log('ffmpeg process started:', command)
      })
      .on('error', function (err: any, stdout: any, stderr: any) {
        console.error('Error:', err)
        console.error('ffmpeg stderr:', stderr)
      })
      .on('end', function (output: any) {
        console.error('Audio created in:', output)
        res.json({status: 'OK'})
      })
    
  }catch(err){
    console.log(err)
  }
};

export {
  addSentence,
  editSentence,
  getCognitionTopN,
  getAllSents,
  getOneSent,
  similarityCalculate,
  soundStream,
  concatAudios,
};