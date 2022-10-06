import mongoose, { Schema, Document, model } from "mongoose";
// import Wordbase from './Wordbase';
import Word from './Word';


// Define 数据类型，TS 要用
export interface ISent extends Document {
  en: string;
  zh: string;
  label?: Array<string>;
  sound?: string;
  words?: Array<object>;  // 对应句中出现的重点词
  histInput?: Array<string>  // 历史输入

  idc: {  // indicator，指标
    occurrencesHistory?: Number; // 历史出现次数
    inMindhis?: Number;          // 历史记住次数
    offMindhis?: Number;         // 历史没记住次数
    occurrencesLastMonth?: Number; // 近 1 个月出现次数
    inMindhisLstMth?: Number;      // 近 1 个月记住次数
    offMindhisLstMth?: Number;     // 近 1 个月没记住次数
    cognition?: Number;   // 整体认知度
  };
}

// WordSchema，后面 const 定义 Word 实例要用
const SentSchema: Schema = new Schema(
  {
    en: { type: String, required: true, unique: true},
    zh: { type: String, required: true, },
    label: [{ type: String, }],
    sound: { type: String },
    words: [{ type: Schema.Types.ObjectId, ref: Word } ],
    histInput: [{ type: String, }],

    idc: {  // indicator，指标
      occurrencesHistory: { type: Number, default: 0 },
      inMindhis: { type: Number, default: 1000 },
      offMindhis: { type: Number, default: 0 }, // 历史没记住次数
      occurrencesLastMonth: { type: Number, default: 0 }, // 近 1 个月出现次数
      inMindhisLstMth: { type: Number, default: 0 }, // 近 1 个月记住次数
      offMindhisLstMth: { type: Number, default: 0 }, // 近 1 个月没记住次数
      cognition: {type: Number, default: 0.0}, // 整体认知度
    },
  },
  { collection: "sentences", timestamps: true }
);

// Schema 的实例，就跟个对象 Object 一样；
const Sentence = model<ISent>("Sentence", SentSchema);
export default Sentence;