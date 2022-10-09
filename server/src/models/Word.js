"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// WordSchema，后面 const 定义 Word 实例要用
var WordSchema = new mongoose_1.Schema({
    word: { type: String, required: true, unique: true },
    rootOrAffix: { type: String },
    label: [{ type: String, }],
    phrase: [{ type: String, }],
    soundmark: { type: String },
    soundmarkCognition: { type: Number, default: 0 },
    definition: { type: String },
    definitionCognition: { type: Number, default: 0 },
    examples: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Sentence' }],
    derivation: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Word" }],
    synonym: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Word" }],
    confusion: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Word" }],
    idc: {
        occurrencesHistory: { type: Number, default: 0 },
        inMindhis: { type: Number, default: 0 },
        offMindhis: { type: Number, default: 0 },
        occurrencesLastMonth: { type: Number, default: 0 },
        inMindhisLstMth: { type: Number, default: 0 },
        offMindhisLstMth: { type: Number, default: 0 },
        cognition: { type: Number, default: 0.0 }, // 整体认知度
    },
    isInRankList: { type: Boolean } // 是否作为主词
}, { collection: "words", timestamps: true });
// Schema 的实例，就跟个对象 Object 一样；
var Word = (0, mongoose_1.model)("Word", WordSchema);
exports.default = Word;
