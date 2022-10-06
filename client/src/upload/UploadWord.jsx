import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import httpClient from "../api/http-common";
import Select from 'react-select';
import InfoShow from '../components/InfoShow'

const UploadWord = () => {
  const [word_, setWord_] = useState("");
  const [rootOrAffix_, setRootOrAffix_] = useState("");
  const [label_, setLabel_] = useState([""]);
  const [selectValue, setSelectValue] = useState(false);
  const [waitSplit, setWaitSplit ] = useState([]);
  
  const [definition_, setDefinition_] = useState("");
  const [soundmark_, setSoundmark_] = useState("");

  const [phrase_, setPhrase_ ] = useState("");

  const options = [
    { value: true, label: 'isInRankList', },
    { value: false, label: 'NotInRankList' },
  ];

  // const [postResult, setPostResult] = useState(null);
  const [postResult, setPostResult] = useState({'status':null, 'res':null});

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  // 将 mutate 解构赋值给 postTutorial
  // const { isLoading: isPostingTutorial, mutate: postWord } = useMutation(
  const { status, data, error , mutate: postWord } = useMutation(
    async () => {
      return await httpClient.post(`/word`,  {
        /* 测试 Node Express 接口代码： */
        word: word_,
        rootOrAffix: rootOrAffix_,
        soundmark: soundmark_,
        definition: definition_,
        label: label_,
        phrase: phrase_,
      })},
    // {
    //   onSuccess: (res) => { console.log('Success!!',res);setPostResult({status: 'success',res: res?.data}) },
    //   onError: (err) => { console.log('Error!!',err); setPostResult({status: 'error', res: err?.response?.data || err});},
    // }
  );



  useEffect(()=>{
    if(status === 'success'){ console.log('Success!!',data);setPostResult({status: 'success',res: data?.data}) }
    else if(status === 'error') { console.log('Error!!',error); setPostResult({status: 'error', res: error?.response?.data || err})}
    else { setPostResult({status:'pending',res:"posting..."}); }
  },[status, data, error])



  // refetch 重命名为 getOneWord手动 拾取
  const { isLoading: isGetingOneWord, refetch: getOneWord } = useQuery(
    "query-word-id",
    async () => {
      console.log('wordExt', wordExt)
      return await httpClient.get(`/word/data/${wordExt}`)
    }, 
    {
      onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
      onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
      refetchOnWindowFocus: false,
      enabled: false  // 禁用查询自动运行
    } 
  );

    /*
    const { isLoading: isEditing, mutate: editWord } = useMutation(
      async () => {
        return await httpClient.put(`/word/${wordExt}`, {
          word: word_,
          rootOrAffix: rootOrAffix_,
          label: label_,
          soundmark: soundmark_,
          definition: definition_,  
          // confusion: [{}],
        })},
      {
        onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
        onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},  
      },
      { enabled: !!wordExt, },  // 直到`wordExt`存在，查询才会被执行
      );
    */
  

  // useEffect(() => {
  //   if (isPostingTutorial || isPostingExtension ) 
  //     setPostResult({status:'pending',res:"posting..."});
  // }, [isPostingTutorial, isPostingExtension]);


  const applyFunc = (func, e) => {
    try { 
      func(); 
      setTimeout(()=>{
        clearPostOutput();
      },10000) 

    } 
    catch (err) { setPostResult(fortmatResponse(err)); }
  }

  const clearPostOutput = () => {
    setDefinition_("")
    setLabel_("")
    setPhrase_("")
    setRootOrAffix_("")
    setSoundmark_("")
    setWaitSplit("")
    setWord_("")
    setPostResult("")
  };

  const handleWaitSplit = (str) => {
    setWaitSplit(str)
    const tempArr = str.split(" ").filter(i => i != "")
    const [word_, soundmark_] = tempArr
    const definition_ = tempArr.slice(2, ).join(" ")
    setWord_(word_)
    setSoundmark_(soundmark_)
    setDefinition_(definition_)
    console.log('word_,soundmark_,definition_', word_,soundmark_,definition_)
  }
  return (
      <div className='---- Words Upload Part -----  text-lg'>
        <div className="text-2xl">Words Upload</div>
        
        <input className='bg-slate-100 rounded-lg  w-full block  py-1 px-1'
          type="text"
          value={waitSplit}
          onChange={(e) => handleWaitSplit(e.target.value)}
          placeholder="write a line ... "
        />
      
        <input
          className='block w-full'
          type="text"
          value={word_}
          onChange={(e) => setWord_(e.target.value)}
          placeholder="write word ... "
        />
        
        <input
          type="text"
          className='block w-full'
          value={rootOrAffix_}
          onChange={(e) => setRootOrAffix_(e.target.value)}
          placeholder="write rootOrAffix_ ... "
        />

        <input
          type="text"
          className='block w-full'
          value={soundmark_}
          onChange={(e) => setSoundmark_(e.target.value)}
          placeholder="write soundmark ..."
        />

        <input type="text"
          className='block w-full'
          value={definition_}
          onChange={(e) => setDefinition_(e.target.value)}
          placeholder="write definition ..."
        />

        <input
          type="text"
          value={label_}
          onChange={(e) => setLabel_( e.target.value.split(",").map(i => i.trim()) ) }
          className='block w-full'
          placeholder="write label_ like `economy, finance`"
        />

        <input type="text"
          className='block w-full'
          value={phrase_}
          onChange={(e) => setPhrase_( e.target.value.split(",").map(i => i.trim()) ) }
          placeholder="write phrase_ like `xx , yy`"
        />
      

        {/* <Select 
          options={options} 
          defaultValue={options[1]}
          onChange={(e) => setSelectValue(e.value)} /> */}
        <div className='flex w-1/2 justify-between'>
          <button className="border-2 rounded-md bg-slate-300 m-2 px-2 shadow" onClick={(e) => applyFunc(postWord)}>
            Post Data
          </button>
          <button
            className="border-2 rounded-md bg-slate-300 m-2 px-2 shadow"
            onClick={clearPostOutput}
          >
            Clear
          </button>
        </div>
        {/*  ---- Words Upload Part end -----  */}


      {/* 前端 展现 Post 的结果 response 信息 */}
      {/* <InfoShow {...postResult}  /> */}
      {/* {postResult && (
        <div className="alert alert-secondary mt-2" role="alert">
          <pre>{postResult}</pre>
        </div>
      )} */}
      <hr />
      </div>  
      


  );
}
export default UploadWord;