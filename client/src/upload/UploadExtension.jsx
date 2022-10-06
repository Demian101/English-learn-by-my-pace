import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import httpClient from "../api/http-common";
import Select from 'react-select';
import InfoShow from '../components/InfoShow'

const UploadExtension = () => {
  // Extension part
  const [wordExt, setWordExt] = useState("")
  const [derivaWord, setDerivaWord] = useState("")
  const [synonWord, setSynonWord] = useState("")
  const [confusion, setConfuseWord] = useState("")

  // const [postResult, setPostResult] = useState(null);
  const [postResult, setPostResult] = useState({'status':null, 'res':null});

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  const { isLoading: isPostingExtension, mutate: putWordExt } = useMutation(
    async () => {
      console.log('putWordExt', wordExt);    // 设置 wordExt 的 id
      return await httpClient.put(`/word/${wordExt}/addition`, {
        word: wordExt,
        derivation: derivaWord,
        synonym: synonWord,
        confusion: confusion,
      })},
      {
        onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
        onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
      },
      { enabled: !!wordExt, }, // 直到`wordExt`存在，查询才会被执行
    );

  // Get Extra info like derivation, 
  const { isLoading: isGetingWordInfo, refetch: getExtraInfo } = useQuery(
    "query-word-extra-info",
    async () => {
      console.log('wordExt', wordExt)
      return await httpClient.get(`/word/info/${wordExt}`)
    },
    { 
      onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
      onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
      refetchOnWindowFocus: false,
      enabled: false  // 禁用查询自动运行
    }
  );

    // useEffect(()=>{
    //   if(status === 'success'){ console.log('Success!!',data);setPostResult({status: 'success',res: data?.data}) }
    //   else if(status === 'error') { console.log('Error!!',error); setPostResult({status: 'error', res: error?.response?.data || err})}
    //   else { setPostResult({status:'pending',res:"posting..."}); }
    // },[status, data, error])
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
      setPostResult("")
    };
  return(
      <div className="col-start-1 col-span-1">
        <div className="text-2xl py-2">Word Extension POST</div>
        <input
          type="text"
          className='w-full block'
          value={wordExt}
          onChange={(e) => setWordExt(e.target.value) }
          placeholder="write wordExt ... "
        />
        <input
          type="text"
          className='w-full block'
          value={derivaWord}
          onChange={(e) => setDerivaWord(e.target.value)}
          placeholder="write derivaWord like `cohere, adhere, adherent`"
        />

        <input
          type="text"
          className='w-full block'
          value={synonWord}
          onChange={(e) => setSynonWord(e.target.value)}
          placeholder="write synonWord like `cohere, adhere, adherent` "
        />
        <input
          type="text"
          className='w-full block'
          value={confusion}
          onChange={(e) => setConfuseWord(e.target.value)}
          placeholder="write confusion like `cohere, adhere, adherent` "
        />


        <button className="border-2 rounded-md bg-slate-300 m-2" onClick={(e) => applyFunc(putWordExt)}>
          Put Data（Ext
        </button>


        
        <button className="border-2 rounded-md bg-slate-300 m-2" onClick={(e) => applyFunc(getExtraInfo)}>
          Get All Data
        </button>
      </div>

  )

}

export default UploadExtension;