"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// import Wordbase from './Wordbase';
var Word_1 = __importDefault(require("./Word"));
// WordSchema，后面 const 定义 Word 实例要用
var SentSchema = new mongoose_1.Schema({
    en: { type: String, required: true, unique: true },
    zh: { type: String, required: true, },
    label: [{ type: String, }],
    sound: { type: String },
    words: [{ type: mongoose_1.Schema.Types.ObjectId, ref: Word_1.default }],
    histInput: [{ type: String, }],
    idc: {
        occurrencesHistory: { type: Number, default: 0 },
        inMindhis: { type: Number, default: 1000 },
        offMindhis: { type: Number, default: 0 },
        occurrencesLastMonth: { type: Number, default: 0 },
        inMindhisLstMth: { type: Number, default: 0 },
        offMindhisLstMth: { type: Number, default: 0 },
        cognition: { type: Number, default: 0.0 }, // 整体认知度
    },
}, { collection: "sentences", timestamps: true });
// Schema 的实例，就跟个对象 Object 一样；
var Sentence = (0, mongoose_1.model)("Sentence", SentSchema);
exports.default = Sentence;
