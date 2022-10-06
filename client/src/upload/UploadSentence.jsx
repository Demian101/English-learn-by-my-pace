import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import httpClient from "../api/http-common";

const UploadSentence = () => {
  const [en,setEn] = useState("");
  const [zh,setZh] = useState("");
  const [words,setWords] = useState("");
  const [labels,setLabels] = useState("");
  const [currentStatu, setCurrentStatu] = useState("");



  const postSentence = async () => {
    return await httpClient.post(`/sen`,  {
      /* 测试 Node Express 接口代码： */
      en,
      zh,
      label: labels,
      words,
    })
  }
  const { status, error , mutate: postSent } = useMutation( 
    "post Sentence", postSentence
  ); // 发送句子到后端

  const postSentenceToCheck = async () => {
    // setEn(e.target.value); 
    // i love inherent extrinsic country about 
    return await httpClient.post(`/word/check` , {
      'sen': en
    })
  }
  
  // 这就是 React-Query 处理禁止自动查询（改为手动触发如 Button 触发的方式）：
  // ① 先设refetch ② 将 enabled 设为 false 
  const { isFetching, data,isError, isLoading, isSuccess, refetch: checkWordsExistence } = useQuery(
    "check-Words-Existence",
    postSentenceToCheck,
    {
      enabled: Boolean(en)
    } // Boolean("") is false
  );


    const applyFunc = (func, e) => {
      try { 
        func(); 
        setTimeout(()=>{
          clearPostOutput();
        },10000) 
      } 
      catch (err) { }
    }
    const clearPostOutput = () => {
      setEn("")
      setZh("")
      setLabels("")
      setWords("")
    };

  console.log('isFetching, data, isLoading, isSuccess, '    ,isFetching, data, isLoading, isSuccess,)

  useEffect(()=>{
    if (!en) { 
      console.log('en--- ', en);
      setCurrentStatu("No word") 
    }
    else if (isFetching) {setCurrentStatu("Fetching...")}
    else if(isSuccess) {
      console.log('data.data', data?.data)
      if(data?.data) {setCurrentStatu(`${data?.data.join(" ")} existing ~ `)}
      else { setCurrentStatu(`No word existing ~ Pls add the word next ↓ `) }
    }
    else if(isError) setCurrentStatu(isError)
  }, [isFetching, isSuccess, isError, en])

  return(
    <div className='---- Sentences Upload Part -----  text-lg col-start-1 col-span-1"'>
      <div className="text-2xl">Sentence Upload</div>
      
      <input className='bg-slate-100 rounded-lg  w-full block  py-1 px-1'
        type="text"
        value={en}
        onChange={(e) => setEn(e.target.value) }
        placeholder="write an english sentence ... "
      /> 
      {currentStatu && <span className=' text-red-400'> {currentStatu} </span>  }
       {/* {isLoadingSentenceInfo && <span className=' text-red-400'> Fetching...</span>  }
          {!checkData?.data && <span className='pl-4 text-green-400'> No word existing ~ Pls add the word first ~  </span>  }
          {(checkData?.data && en )&& <span className='pl-4 text-red-400'> {checkData?.data.join(' ')} existing ~  </span>  } */}
      <input className='bg-slate-100 rounded-lg  w-full block  py-1 px-1'
        type="text"
        value={zh}
        onChange={(e) => setZh(e.target.value)}
        placeholder="write a 中文翻译 ... "
      />
      <input className='bg-slate-100 rounded-lg  w-full block  py-1 px-1'
        type="text"
        value={words}
        onChange={(e) => setWords( e.target.value.split(",").map(i => i.trim()) )}
        placeholder="write related words like forfeit, deposit ... "
      />
      <input className='bg-slate-100 rounded-lg  w-full block  py-1 px-1'
        type="text"
        value={labels}
        onChange={(e) => setLabels( e.target.value.split(",").map(i => i.trim()) )}
        placeholder="write labels like web3, blockchain ... "
      />

      <div className='flex w-1/2 justify-between'>
        <button className="border-2 rounded-md bg-slate-300 m-2 px-2 shadow" onClick={(e) => applyFunc(postSent)}>
          Post Data
        </button>
        <button
          className="border-2 rounded-md bg-slate-300 m-2 px-2 shadow"
          onClick={clearPostOutput}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
export default UploadSentence;