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
exports.checkWordsExistence = exports.putRecogn = exports.getCognitionTopN = exports.getExtraInfo = exports.addWordExtension = exports.updateWord = exports.addWord = exports.getOneWord = exports.getAllWords = void 0;
var Word_1 = __importDefault(require("../models/Word"));
// import Sentence, {ISent} from "../models/Sentence"
var wordFields = 'idc.cognition word rootOrAffix label soundmark definition phrase examples';
var SentFields = 'idc.cognition en zh label sound words';
// 获取认知度排名最低的 N 个 Master 单词
var getCognitionTopN = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var topWords, promises, wordsList, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, Word_1.default.find() // {isInRankList: true}
                        .sort({ 'idc.cognition': 1 })
                        .select('word')
                        .limit(10)];
            case 1:
                topWords = _a.sent();
                if (topWords) {
                    console.log('topWords', topWords);
                }
                return [4 /*yield*/, topWords.map(function (word_) { return __awaiter(void 0, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Word_1.default.findOne({ 'word': word_ === null || word_ === void 0 ? void 0 : word_.word })
                                        .select(wordFields)
                                        .populate('derivation', wordFields) // 选择 derivation 里所需要的字段
                                        .populate('synonym', wordFields)
                                        .populate('confusion', wordFields)
                                        .populate('examples', SentFields)];
                                case 1:
                                    data = _a.sent();
                                    return [2 /*return*/, data];
                            }
                        });
                    }); })];
            case 2:
                promises = _a.sent();
                return [4 /*yield*/, Promise.all(promises)];
            case 3:
                wordsList = _a.sent();
                if (wordsList) {
                    res.json(wordsList);
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.json(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getCognitionTopN = getCognitionTopN;
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
var putRecogn = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            // const WordById: any = await Word.findOne({'word': req.params.id});   // process
            res.json({
                "test": 'test',
            });
        }
        catch (err) {
            console.log("error: ------- ", err);
            // res.status(500).json( {message: "Something went wrong"} )
        }
        return [2 /*return*/];
    });
}); };
exports.putRecogn = putRecogn;
var getAllWords = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var words, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Controller getAllWords...');
                return [4 /*yield*/, Word_1.default.find()
                        .sort({ createdAt: -1 })
                        .select(wordFields)];
            case 1:
                words = _a.sent();
                res.json(words);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log("error: ------- ", err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllWords = getAllWords;
var getOneWord = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, word_, word, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                name_1 = req.params.id;
                console.log('getOneWordId req.params, name)', req.params, name_1);
                return [4 /*yield*/, Word_1.default.findOne({ 'word': name_1 })]; // {'word': word}
            case 1:
                word_ = _a.sent() // {'word': word}
                ;
                return [4 /*yield*/, Word_1.default.findById(word_ === null || word_ === void 0 ? void 0 : word_._id)
                        // .select("-password")
                        .select(wordFields)];
            case 2:
                word = _a.sent();
                if (word) {
                    console.log('The word : ------------ ', word);
                    res.json(word);
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getOneWord = getOneWord;
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
var addWord = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, word, rootOrAffix, soundmark, definition, label, phrase, isInRankList, wordExists, word_, savedWord, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, word = _a.word, rootOrAffix = _a.rootOrAffix, soundmark = _a.soundmark, definition = _a.definition, label = _a.label, phrase = _a.phrase, isInRankList = _a.isInRankList;
                console.log("Controller addWord ", word);
                return [4 /*yield*/, Word_1.default.findOne({ word: word })];
            case 1:
                wordExists = _b.sent();
                if (!wordExists) return [3 /*break*/, 2];
                res.status(409).json({ message: "The word ".concat(word, " already exists !!!!!") });
                return [3 /*break*/, 4];
            case 2:
                word_ = new Word_1.default({
                    word: word,
                    rootOrAffix: rootOrAffix,
                    soundmark: soundmark,
                    definition: definition,
                    label: label,
                    isInRankList: isInRankList,
                    phrase: phrase
                });
                return [4 /*yield*/, word_.save()];
            case 3:
                savedWord = _b.sent();
                if (savedWord) {
                    res.json(word_);
                    console.log(word_);
                }
                ;
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_4 = _b.sent();
                console.log("error: ------- ", err_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addWord = addWord;
var mapLoop = function (strs) { return __awaiter(void 0, void 0, void 0, function () {
    var arrStr, promises, wordIds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                arrStr = strs.split(",").map(function (item) { return item.trim(); });
                return [4 /*yield*/, arrStr.map(function (word_) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, Word_1.default.findOne({ word: word_ })];
                        });
                    }); })];
            case 1:
                promises = _a.sent();
                return [4 /*yield*/, Promise.all(promises)];
            case 2:
                wordIds = _a.sent();
                return [2 /*return*/, wordIds.map(function (item) { return item === null || item === void 0 ? void 0 : item._id; }).filter(function (i) { return i; })]; // 不能过早地调 ._id !!!
        }
    });
}); };
// PUT - Update
var updateWord = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, word, derivation, synonym, confusion, soundmark, definition, label, phrase, isInRankList, editedWord, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Controller updateWord req.params.id', req.params.id);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, word = _a.word, derivation = _a.derivation, synonym = _a.synonym, confusion = _a.confusion, soundmark = _a.soundmark, definition = _a.definition, label = _a.label, phrase = _a.phrase, isInRankList = _a.isInRankList;
                return [4 /*yield*/, Word_1.default.findOneAndUpdate({ 'word': req.params.id }, {
                        $set: {
                            word: word,
                            soundmark: soundmark,
                            definition: definition,
                            label: label,
                            phrase: phrase,
                            isInRankList: isInRankList
                        }
                    }, { new: true })];
            case 2:
                editedWord = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                console.log("error: ------- ", err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateWord = updateWord;
// Put -  对 Extension 拓展信息的补充 'extension'
var addWordExtension = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, word, derivation, synonym, confusion, word_, derivationIdArr, i, synonymIdArr, i, confusionArr, i, pushed, err_6;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                console.log('Controller addWordExtension req.params.id', req.params.id);
                _e.label = 1;
            case 1:
                _e.trys.push([1, 12, , 13]);
                _a = req.body, word = _a.word, derivation = _a.derivation, synonym = _a.synonym, confusion = _a.confusion;
                return [4 /*yield*/, Word_1.default.findOne({ word: req.params.id })];
            case 2:
                word_ = _e.sent();
                if (!!word_) return [3 /*break*/, 3];
                res.status(404).json({ message: "Word Does Not exists !!!!!" });
                return [3 /*break*/, 11];
            case 3:
                if (!derivation) return [3 /*break*/, 5];
                return [4 /*yield*/, mapLoop(derivation)];
            case 4:
                derivationIdArr = _e.sent();
                for (i = 0; i < derivationIdArr.length; i++) {
                    if (word_ === null || word_ === void 0 ? void 0 : word_.derivation.includes(derivationIdArr[i])) {
                        res.status(409).json({ message: "derivation already exists !!!!!" });
                    }
                    console.log('derivationIdArr[i] ... ', derivationIdArr[i]);
                    (_b = word_ === null || word_ === void 0 ? void 0 : word_.derivation) === null || _b === void 0 ? void 0 : _b.push(derivationIdArr[i]); // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
                }
                ;
                _e.label = 5;
            case 5:
                if (!synonym) return [3 /*break*/, 7];
                return [4 /*yield*/, mapLoop(synonym)];
            case 6:
                synonymIdArr = _e.sent();
                for (i = 0; i < synonymIdArr.length; i++) {
                    if (word_ === null || word_ === void 0 ? void 0 : word_.synonym.includes(synonymIdArr[i])) {
                        res.status(409).json({ message: "synonym already exists !!!!!" });
                    }
                    (_c = word_ === null || word_ === void 0 ? void 0 : word_.synonym) === null || _c === void 0 ? void 0 : _c.push(synonymIdArr[i]); // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
                }
                ;
                _e.label = 7;
            case 7:
                if (!confusion) return [3 /*break*/, 9];
                return [4 /*yield*/, mapLoop(confusion)];
            case 8:
                confusionArr = _e.sent();
                for (i = 0; i < confusionArr.length; i++) {
                    if (word_ === null || word_ === void 0 ? void 0 : word_.confusion.includes(confusionArr[i])) {
                        res.status(409).json({ message: "confusion already exists !!!!!" });
                    }
                    (_d = word_ === null || word_ === void 0 ? void 0 : word_.confusion) === null || _d === void 0 ? void 0 : _d.push(confusionArr[i]); // [ new ObjectId("6304e9c21ef50c540cb0630a"),  ]
                }
                ;
                _e.label = 9;
            case 9:
                if (!word_) return [3 /*break*/, 11];
                return [4 /*yield*/, word_.save()];
            case 10:
                pushed = _e.sent();
                res.status(200).json(pushed);
                _e.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_6 = _e.sent();
                console.log("error: ------- ", err_6);
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.addWordExtension = addWordExtension;
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
var getExtraInfo = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var name_2, word_, wordInfo_derivation, wordInfo_synonym, wordInfo_confusion, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                // const WordById: any = await Word.findById(req.params.id);
                console.log('Controller getExtraInfo - req.params.id: `````', req.params.id, '``````');
                name_2 = req.params.id;
                return [4 /*yield*/, Word_1.default.findOne({ 'word': name_2 })]; // {'word': word}
            case 1:
                word_ = _a.sent() // {'word': word}
                ;
                return [4 /*yield*/, Word_1.default.find({ _id: { $in: word_ === null || word_ === void 0 ? void 0 : word_.derivation } })];
            case 2:
                wordInfo_derivation = _a.sent();
                return [4 /*yield*/, Word_1.default.find({ _id: { $in: word_ === null || word_ === void 0 ? void 0 : word_.synonym } })];
            case 3:
                wordInfo_synonym = _a.sent();
                return [4 /*yield*/, Word_1.default.find({ _id: { $in: word_ === null || word_ === void 0 ? void 0 : word_.confusion } })];
            case 4:
                wordInfo_confusion = _a.sent();
                res.json({
                    mainWord: word_,
                    derivation: wordInfo_derivation,
                    synonym: wordInfo_synonym,
                    confusion: wordInfo_confusion,
                });
                return [3 /*break*/, 6];
            case 5:
                err_7 = _a.sent();
                console.log(err_7);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getExtraInfo = getExtraInfo;
//  query a sentence. checkWordsExistence
var checkWordsExistence = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var sen, resList, _i, _a, word, res_1, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Controller checkWordsExistence... ", req.body.sen);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                sen = req.body.sen;
                resList = [];
                _i = 0, _a = sen.split(' ');
                _b.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                word = _a[_i];
                return [4 /*yield*/, Word_1.default.findOne({ word: word })];
            case 3:
                res_1 = _b.sent();
                if (res_1) {
                    resList.push(res_1.word);
                }
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                if (resList.length > 0) {
                    res.status(200).json(resList);
                }
                else
                    (res.status(500).json({ message: "Something went wrong" }));
                return [3 /*break*/, 7];
            case 6:
                err_8 = _b.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.checkWordsExistence = checkWordsExistence;
