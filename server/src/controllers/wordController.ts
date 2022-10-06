import { NextFunction, Request, Response } from "express";
import { List } from "reselect/es/types";
import Word,{ IWord } from "../models/Word";
// import Sentence, {ISent} from "../models/Sentence"

const wordFields = 'idc.cognition word rootOrAffix label soundmark definition phrase examples'
const SentFields = 'idc.cognition en zh label sound words'
 

// 获取认知度排名最低的 N 个 Master 单词
const getCognitionTopN = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topWords: any = await Word.find()  // {isInRankList: true}
      .sort({'idc.cognition': 1})
      .select('word')
      .limit(10);
    if(topWords) {console.log('topWords', topWords) }

    const promises: List<Promise<any>> = await topWords.map(async (word_: any) => {
      const data: any = await Word.findOne({'word': word_?.word})
      .select(wordFields)
      .populate('derivation', wordFields)  // 选择 derivation 里所需要的字段
      .populate('synonym',    wordFields)
      .populate('confusion',  wordFields)
      .populate('examples', SentFields)
      return data
    });
    const wordsList = await Promise.all(promises);  
    if (wordsList){ res.json(wordsList) }
  }
  catch(err){ 
    res.json(err)
    //res.status(500).json({message: "Something went wrong"}) 
  }
}

/*
------- req.body : -------  {
  list: [
    { word: [Object] },
    { definition: [Object], delta: -1 },
    { soundmark: [Object], delta: -1 },
    { ex1: [Object], delta: -1 },
    { ex2: [Object], delta: -1 },
    { ex3: [Object], delta: -1 }
  ]
}
*/
const putRecogn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const WordById: any = await Word.findOne({'word': req.params.id});   // process
      res.json({
        "test": 'test',
      });
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
}

const getAllWords = async (req: Request, res: Response, next: NextFunction) => {
  try{
    console.log('Controller getAllWords...');
    const words = await Word.find()
      .sort({ createdAt: -1 })
      .select(wordFields)
    res.json(words);
  } catch(err){
     console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
};


const getOneWord = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const name = req.params.id;  //   `/:id`  用 req.params
    console.log('getOneWordId req.params, name)', req.params, name)
    const word_ = await Word.findOne({'word': name}) // {'word': word}

    const word = await Word.findById(word_?._id)
      // .select("-password")
      .select(wordFields)
    if (word) { 
      console.log('The word : ------------ ', word) ;
      res.json(word); 
    }

  } catch(err){
    console.log(err)
    //res.status(500).json( {message: "Something went wrong"} )
  }
};

/*  数据结构设计不好产生的丑陋代码：
const addSentence = async (en1:string,zh1:string, en2:string,zh2:string, en3:string, zh3:string, label:any, _id:any, res: Response) => {
  try{
    const sentenceExists = await Sentence.findOne({ en1 });  // findOne({ 'word': word });
    if (sentenceExists) { 
      res.status(409).json({ message: "Exists! - This sentence already exists !!!!!" });
    }else {
      const sent_: ISent = new Sentence({ en: en1, zh: zh1, label });
      sent_.words?.push(_id);
      const savedSent = await sent_.save();
      if(savedSent){ console.log('savedSent ! One sentence insert successfully!')}
    }
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
};
if(savedWord){
  addSentence(ex1?.ex1En, ex1?.ex1Zh, ex2?.ex2En, ex2?.ex2Zh, ex3?.ex3En,ex3?.ex3Zh,label, savedWord._id, res)
}
*/

const addWord = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const { word, rootOrAffix, soundmark, definition, label, phrase, isInRankList } = req.body;
    console.log("Controller addWord ", word)
    const wordExists = await Word.findOne({ word });  // findOne({ 'word': word });
    if (wordExists) { res.status(409).json({ message: `The word ${word} already exists !!!!!`});} 
    else {
      const word_: IWord = new Word({
         word, rootOrAffix, soundmark, definition, label, isInRankList, phrase
      });
      const savedWord = await word_.save();
      if(savedWord){
        res.json(word_)
        console.log(word_)
      };
    }
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
};


const mapLoop = async (strs: string) => {
  const arrStr = strs.split(",").map( (item) => item.trim());
  const promises: List<Promise<any>> = await arrStr.map(async (word_) => {
    return Word.findOne({ word: word_ });
  });
  const wordIds = await Promise.all(promises);  
  return wordIds.map((item) => item?._id).filter(i => i) // 不能过早地调 ._id !!!
};


// PUT - Update
const updateWord = async ( req: Request, res: Response, next: NextFunction) => {
  console.log('Controller updateWord req.params.id', req.params.id );
  try {  
    const { word, derivation, synonym, confusion, soundmark, definition, label, phrase, isInRankList } = req.body;   // confusionWord 
    const editedWord:any =  await Word.findOneAndUpdate({'word': req.params.id}, {
      $set: {
        word,
        soundmark,
        definition,
        label,
        phrase,
        isInRankList
      }
    }, {new: true});
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
}

// Put -  对 Extension 拓展信息的补充 'extension'
const addWordExtension = async ( req: Request, res: Response, next: NextFunction) => {
  console.log('Controller addWordExtension req.params.id', req.params.id);

  try {
    const { word, derivation, synonym, confusion, } = req.body;   // confusionWord 
    const word_: any = await Word.findOne({word: req.params.id});   // process
    if (!word_) {       // if word exists
      res.status(404).json({ message: "Word Does Not exists !!!!!" });
    } else {
      if(derivation){
        const derivationIdArr: any = await mapLoop(derivation);

        for (let i = 0; i < derivationIdArr.length; i++) {
          if (word_?.derivation.includes(derivationIdArr[i])){
            res.status(409).json({ message: "derivation already exists !!!!!"})
          }
          console.log('derivationIdArr[i] ... ' , derivationIdArr[i])
          word_?.derivation?.push(derivationIdArr[i])  // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
        };
      }
      if(synonym){
        const synonymIdArr: any = await mapLoop(synonym);

        for (let i = 0; i < synonymIdArr.length; i++) {
          if (word_?.synonym.includes(synonymIdArr[i])){
            res.status(409).json({ message: "synonym already exists !!!!!"})
          }
          word_?.synonym?.push(synonymIdArr[i])  // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
        };  
      }

      if(confusion){
        const confusionArr: any = await mapLoop(confusion);
        for (let i = 0; i < confusionArr.length; i++) {
          if (word_?.confusion.includes(confusionArr[i])){
            res.status(409).json({ message: "confusion already exists !!!!!"})
          }
          word_?.confusion?.push(confusionArr[i])  // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
        };  
      }

      if (word_) {
        const pushed: any = await word_.save();
        res.status(200).json(pushed)
      }
    }  /* if !word_ end*/
  }
  catch(err){
    console.log("error: ------- ", err);
    // res.status(500).json( {message: "Something went wrong"} )
  }
}


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


const getExtraInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const WordById: any = await Word.findById(req.params.id);
    console.log('Controller getExtraInfo - req.params.id: `````', req.params.id, '``````')
    const name = req.params.id;  //   `/:id`  用 req.params
    const word_ = await Word.findOne({'word': name}) // {'word': word}

    const wordInfo_derivation = await Word.find(
        { _id: { $in: word_?.derivation}}
      );
    const wordInfo_synonym = await Word.find(
      { _id: { $in: word_?.synonym}}
    );
    const wordInfo_confusion = await Word.find(
      { _id: { $in: word_?.confusion}} 
    );
    res.json({
      mainWord: word_,
      derivation: wordInfo_derivation,
      synonym: wordInfo_synonym,
      confusion: wordInfo_confusion,
    }); 

  } catch(err){
    console.log(err)
    //res.status(500).json( {message: "Something went wrong"} )
  }
};


//  query a sentence. checkWordsExistence
const checkWordsExistence = async ( req: Request, res: Response, next: NextFunction) => {
  console.log("Controller checkWordsExistence... ", req.body.sen)
  try {
    const { sen } = req.body;   // 后面要赋值， 所以用 let
    let resList = []
    for(const word of sen.split(' ')){   // ['i', 'love', 'you', '']
      const res = await Word.findOne({word})
      if (res){ resList.push(res.word)}
    }
    if(resList.length > 0){
      res.status(200).json(resList)
    }else(
      res.status(500).json( {message: "Something went wrong"} )
    )
  }
  catch(err){}
}

export {
  getAllWords,
  getOneWord,
  addWord,
  updateWord,
  addWordExtension,
  getExtraInfo,
  // getWordById,
  getCognitionTopN,
  putRecogn,
  checkWordsExistence
};