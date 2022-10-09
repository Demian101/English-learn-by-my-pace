import mongoose, { Schema, Document, model } from "mongoose";
import Sentence from "./Sentence";

// Define 数据类型，TS 要用
export interface IWord extends Document {
  word: string;
  rootOrAffix?: string;
  label?: Array<string>;
  phrase?: Array<string>;
  soundmark?: string;
  soundmarkCognition?: Number;
  definition?: string;
  definitionCognition?: Number;
  examples?: Array<object>;   // [sent_id1, sent_id2]

  derivation?: Array<object>;  // 派生、同源
  synonym?: Array<object>;     // 同义
  confusion?: Array<object>;   // 形近易混
  isInRankList?: Boolean;

  idc: {  // indicator，指标
    occurrencesHistory?: Number; // 历史出现次数
    inMindhis?: Number;          // 历史记住次数
    offMindhis?: Number;         // 历史没记住次数
    occurrencesLastMonth?: Number; // 近 1 个月出现次数
    inMindhisLstMth?: Number;      // 近 1 个月记住次数
    offMindhisLstMth?: Number;     // 近 1 个月没记住次数
    // cognition?: mongoose.Types.Decimal128;
    cognition?: Number;   // 整体认知度
  };
}

// WordSchema，后面 const 定义 Word 实例要用
const WordSchema: Schema = new Schema (
  {
    word: { type: String, required: true, unique: true},
    rootOrAffix: { type: String },
    label: [{type: String, }],
    phrase: [{type: String, }],
    soundmark: { type: String },
    soundmarkCognition: {  type: Number, default: 0 },  // soundmark 认知度
    definition: { type: String },
    definitionCognition: {  type: Number, default: 0 },
    examples:   [{type: Schema.Types.ObjectId, ref: 'Sentence' }],

    derivation: [{ type: Schema.Types.ObjectId, ref: "Word" } ],
    synonym:    [{ type: Schema.Types.ObjectId, ref: "Word" } ],
    confusion:  [{ type: Schema.Types.ObjectId, ref: "Word" } ],

    idc: {  // indicator，指标
      occurrencesHistory: { type: Number, default: 0 },
      inMindhis: { type: Number, default: 0 },
      offMindhis: { type: Number, default: 0 }, // 历史没记住次数
      occurrencesLastMonth: { type: Number, default: 0 }, // 近 1 个月出现次数
      inMindhisLstMth: { type: Number, default: 0 }, // 近 1 个月记住次数
      offMindhisLstMth: { type: Number, default: 0 }, // 近 1 个月没记住次数
      cognition: {type: Number, default: 0.0}, // 整体认知度
    },
    isInRankList: { type: Boolean }  // 是否作为主词
  },
  { collection: "words", timestamps: true }
);

// Schema 的实例，就跟个对象 Object 一样；
const Word = model<IWord>("Word", WordSchema);
export default Word;