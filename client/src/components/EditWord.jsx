import React from "react";
import Wordcard from "./Wordcard"

const EditWord = () => {
  let wordObj = {
    word: 'prevail',
    soundmark: 'prɪ\'veɪl',
    rootOrAffix: '-lav-, lava-, lavat-【拉丁】表示“洗”',    // 词根词缀
    definition: `v. 流行, 盛行; 获胜; 占优势`,    // 释义
    exapmple: `-I tried to prevail on him to stay. 我曾劝他留下
-Virtue will prevail against evil.  美德定将战胜邪恶。
-prevail on 劝说, 说服`,
    derivation: [{   // 1. 衍生、派生词  
      word: 'prevalent',
      soundmark: 'pre\'veɪlənt',
      definition: `adj. 流行的, 盛行的; 普遍的; 优势的`,
      exapmple: `-The prevalent opinion is in favour of reform.
-舆论普遍支持改革。` }, 
      {
        word: 'prevalence',
        soundmark: '\'prevələns',
        definition: 'n. 流行, 盛行; 占优势'
    }],
    // synonym: [{}],    // 3. 近、反义词 
    // confusion: [{}]   // 易混词
  };
  return (
  <>
    {/* 主词 */}
    <Wordcard wordObj={wordObj} /> 

    {/* 派生词   */}
    { wordObj.derivation && (
        wordObj.derivation.map(item  => (
          <Wordcard wordObj={item} key={item.word} />
        )))
    }   

    {/* 近、反义词 */}
    { wordObj.synonym && (
        wordObj.synonym.map(item  => (
          <Wordcard wordObj={item} key={item.word} />
        )))
    }   

    {/* 易混词 */}
    { wordObj.confusion && (
        wordObj.confusion.map(item  => (  
          <Wordcard wordObj={item} key={item.word}/>
        )))
    }
  </>
  )
};

export default EditWord;