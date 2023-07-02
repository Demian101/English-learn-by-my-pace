"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.concatAudios = exports.soundStream = exports.similarityCalculate = exports.getOneSent = exports.getAllSents = exports.getCognitionTopN = exports.editSentence = exports.addSentence = void 0;
// import { List } from "reselect/es/types";
var Sentence_1 = __importDefault(require("../models/Sentence"));
var ttsGenerate_1 = require("../utils/ttsGenerate");
var removeUnicode_1 = require("../utils/removeUnicode");
var Word_1 = __importDefault(require("../models/Word"));
var stringSimilarity = require("string-similarity");
var fs = require('fs');
var audioconcat = require('audioconcat');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
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
var addSentence = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, en, zh, label, words, sentenceExists, sent_, _i, words_1, word, word_, savedWord_, res_sound, savedSent, err_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Controller addSentence...');
                _d.label = 1;
            case 1:
                _d.trys.push([1, 13, , 14]);
                _a = req.body, en = _a.en, zh = _a.zh, label = _a.label, words = _a.words;
                return [4 /*yield*/, Sentence_1.default.findOne({ en: en })];
            case 2:
                sentenceExists = _d.sent();
                if (!sentenceExists) return [3 /*break*/, 3];
                res.status(409).json({ message: "Exists! - This sentence already exists !!!!!" });
                return [3 /*break*/, 12];
            case 3:
                sent_ = new Sentence_1.default({
                    en: en,
                    zh: zh,
                    label: label,
                });
                console.log('sent_ raw', sent_);
                if (!((words === null || words === void 0 ? void 0 : words.length) > 0)) return [3 /*break*/, 9];
                _i = 0, words_1 = words;
                _d.label = 4;
            case 4:
                if (!(_i < words_1.length)) return [3 /*break*/, 9];
                word = words_1[_i];
                console.log('word', word);
                return [4 /*yield*/, Word_1.default.findOne({ word: word })];
            case 5:
                word_ = _d.sent();
                if (!word_) return [3 /*break*/, 7];
                (_b = sent_.words) === null || _b === void 0 ? void 0 : _b.push(word_._id);
                (_c = word_.examples) === null || _c === void 0 ? void 0 : _c.push(sent_._id);
                return [4 /*yield*/, word_.save()];
            case 6:
                savedWord_ = _d.sent();
                return [3 /*break*/, 8];
            case 7:
                res.status(404).json({ "message": "word doesn't exist yet, please add it" });
                _d.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 4];
            case 9: return [4 /*yield*/, (0, ttsGenerate_1.ttsGenerate)((0, removeUnicode_1.removeUnicode)(en))];
            case 10:
                res_sound = _d.sent();
                if (!res_sound) {
                    res.status(400).json({ "message": "check charset, like <0xa0> .. " });
                }
                sent_.sound = res_sound === null || res_sound === void 0 ? void 0 : res_sound.filename;
                return [4 /*yield*/, sent_.save()];
            case 11:
                savedSent = _d.sent();
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
                if (savedSent) {
                    res.json(savedSent);
                    // console.log('savedSent .............................. ', savedSent)
                }
                _d.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                err_1 = _d.sent();
                console.log("error: ------- ", err_1);
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.addSentence = addSentence;
// 2. modify Sentence
// 得用 ID，，， 不能用 en
var editSentence = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, en, zh, label, words, wordIdList_1, _i, words_2, word, wordObj, editedSent, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Controller editSentence... ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                _a = req.body, en = _a.en, zh = _a.zh, label = _a.label, words = _a.words;
                console.log('words ---- ', words);
                wordIdList_1 = [];
                _i = 0, words_2 = words;
                _b.label = 2;
            case 2:
                if (!(_i < words_2.length)) return [3 /*break*/, 5];
                word = words_2[_i];
                console.log('word ---- ', word);
                return [4 /*yield*/, Word_1.default.findOne({ word: word })];
            case 3:
                wordObj = _b.sent();
                console.log('wordObj ', wordObj, wordObj === null || wordObj === void 0 ? void 0 : wordObj._id);
                if (wordObj) {
                    wordIdList_1.push(wordObj._id);
                }
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                setTimeout(function () {
                    console.log('wordIdList ...... ', wordIdList_1);
                }, 2000);
                return [4 /*yield*/, Sentence_1.default.findOneAndUpdate({ _id: req.params.id }, {
                        $set: {
                            en: en,
                            zh: zh,
                            label: label,
                            words: wordIdList_1,
                        }
                    }, { new: true })];
            case 6:
                editedSent = _b.sent();
                res.status(200).json(editedSent);
                return [3 /*break*/, 8];
            case 7:
                err_2 = _b.sent();
                res.json(err_2);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.editSentence = editSentence;
// 5. 获取认知度排名最低的 N 个 句子。  Get 10 lowest sentences.
var getCognitionTopN = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var SentFields, WordFields, wordsList, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Controller getCognitionTopN...');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                SentFields = 'idc.cognition en zh label sound words';
                WordFields = 'word rootOrAffix label phrase soundmark definition examples';
                return [4 /*yield*/, Sentence_1.default.find() // {isInRankList: true}
                        .sort({ 'idc.cognition': 1 })
                        .select(SentFields)
                        .populate('words', WordFields) // 选择 derivation 里所需要的字段
                        .limit(10)];
            case 2:
                wordsList = _a.sent();
                // if(topSentences) {console.log('topSentences.length ' , topSentences.length) }
                // const promises: List<Promise<any>> = await topSentences.map(async (sent_: any) => {
                //   console.log('sent_?._id', sent_?._id);
                //   const data: any = await Sentence.findOne({'_id': sent_?._id})
                // return data
                // return Word.findOne({ word: word_ });
                // });
                // const wordsList = await Promise.all(promises);  
                if (wordsList) {
                    console.log('wordsList', wordsList);
                    res.json(wordsList);
                }
                else {
                    res.status(500).json({ message: "Something went wrong" });
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.json(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCognitionTopN = getCognitionTopN;
// getAllSents 获取全部 Sentence 
var getAllSents = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var sents, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Controller getAllSents...');
                return [4 /*yield*/, Sentence_1.default.find()
                        .sort({ createdAt: -1 })];
            case 1:
                sents = _a.sent();
                if (sents) {
                    res.json(sents);
                }
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.log("error: ------- ", err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllSents = getAllSents;
// getOneSent 按 句子内容 获取该句子。
var getOneSent = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, sent_, sent, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                name_1 = req.params.id;
                console.log('getOneWordId req.params, name)', req.params, name_1);
                return [4 /*yield*/, Sentence_1.default.findOne({ 'en': name_1 })]; // {'word': word}
            case 1:
                sent_ = _a.sent() // {'word': word}
                ;
                return [4 /*yield*/, Sentence_1.default.findById(sent_ === null || sent_ === void 0 ? void 0 : sent_._id)
                        // .select("-password")
                        .populate("words")];
            case 2:
                sent = _a.sent();
                if (sent) {
                    res.json(sent);
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.log(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOneSent = getOneSent;
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
var similarityCalculate = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var sent_id, inputEng, sotredEng, similarity, savedEng, err_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Controller similarityCalculate... ", req.params.id);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                sent_id = req.params.id;
                inputEng = req.body.inputEng;
                return [4 /*yield*/, Sentence_1.default.findById(sent_id)];
            case 2:
                sotredEng = _b.sent();
                if (sotredEng) {
                    console.log(inputEng, sotredEng === null || sotredEng === void 0 ? void 0 : sotredEng.en);
                    similarity = stringSimilarity.compareTwoStrings(inputEng, sotredEng === null || sotredEng === void 0 ? void 0 : sotredEng.en);
                    console.log('similarity', similarity);
                    sotredEng.idc.cognition = similarity;
                    (_a = sotredEng === null || sotredEng === void 0 ? void 0 : sotredEng.histInput) === null || _a === void 0 ? void 0 : _a.push(inputEng);
                }
                savedEng = sotredEng === null || sotredEng === void 0 ? void 0 : sotredEng.save();
                if (savedEng) {
                    res.status(200).json(sotredEng);
                }
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                console.log(err_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.similarityCalculate = similarityCalculate;
var soundStream = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var sentId, soundPath, stat, range, readStream, parts, partial_start, partial_end, start, end, content_length;
    return __generator(this, function (_a) {
        console.log('soundStream Controller.... ');
        try {
            sentId = req.params.id;
            console.log("Current directory:", __dirname);
            soundPath = '../pythonTTS/voices/' + sentId + '.mp3';
            stat = fs.statSync(soundPath);
            console.log('req.headers.range', req.headers.range);
            range = req.headers.range;
            if (range !== undefined) {
                parts = range.replace(/bytes=/, "").split("-");
                partial_start = parts[0];
                partial_end = parts[1];
                start = parseInt(partial_start, 10);
                end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
                content_length = (end - start) + 1;
                res.status(206).header({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': content_length,
                    'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
                });
                readStream = fs.createReadStream(soundPath, { start: start, end: end });
            }
            else {
                res.header({
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size
                });
                readStream = fs.createReadStream(soundPath);
            }
            readStream.pipe(res);
        }
        catch (err) {
            console.log(err);
            // res.status(500).json( {message: "Something went wrong"} )
        }
        return [2 /*return*/];
    });
}); };
exports.soundStream = soundStream;
var concatAudios = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var SentFields, WordFields, senList, sound_list_1, today, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('concat Audios Controller.... ');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                SentFields = 'idc.cognition en zh label sound words';
                WordFields = 'word rootOrAffix label phrase soundmark definition examples';
                return [4 /*yield*/, Sentence_1.default.find() // {isInRankList: true}
                        .sort({ 'idc.cognition': 1 })
                        .select('sound')
                        .limit(10)];
            case 2:
                senList = _a.sent();
                sound_list_1 = [];
                if (senList) {
                    senList.map(function (obj) {
                        sound_list_1.push('../pythonTTS/voices/' + (obj === null || obj === void 0 ? void 0 : obj.sound));
                        sound_list_1.push('../pythonTTS/concat/blank.mp3'); // 加一段空白过渡，要求：「和 Sentence 一致：单声道 mono，24K 采样频率，否则 concat 不成功」
                    });
                }
                if (sound_list_1) {
                    console.log('sound_list', sound_list_1);
                }
                today = new Date();
                audioconcat(sound_list_1)
                    .concat("../pythonTTS/concat/".concat(today.toISOString().split('T')[0], ".mp3")) // -> '2022-10-31'
                    .on('start', function (command) {
                    console.log('ffmpeg process started:', command);
                })
                    .on('error', function (err, stdout, stderr) {
                    console.error('Error:', err);
                    console.error('ffmpeg stderr:', stderr);
                })
                    .on('end', function (output) {
                    console.error('Audio created in:', output);
                    res.json({ status: 'OK' });
                });
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                console.log(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.concatAudios = concatAudios;
