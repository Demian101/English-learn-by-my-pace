/* 
 * fetch 10 data，Everyone been showed as <WordPreviewed> 
 * 后端 BacK End Api - '/word/topN'
 */

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import apiClient from "../api/http-common";
import InfoShow from './InfoShow'
import WordPreview from './WordPreview'
import { FaChevronRight } from 'react-icons/fa';

const Main = () => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);  // 控制顺序
  const [wordCurrent, setWordCurrent] = useState(null);

  const [postResult, setPostResult] = useState({'status': null, 'res': null});
  // Post the recognition info to Backend
  const [putRecogData, setPutRecogData] = useState();

  const nextWordHandler = (res) => {
    setPutRecogData(res);
  };
  console.log('wordCurrent .... ' , wordCurrent)

  const { isLoading: isGettingCognitionTopN, refetch: getCognitionTopN } = useQuery(
    "Query-topN-lowest-awareness-words",
    async () => {
      console.log('useQuery Get topN-lowest-awareness-words')
      return await apiClient.get(`/word/topN`)
    }, 
    {
      onSuccess: (res) => { 
        setPostResult({status: 'success',res: res}); // Debug 用的
        setData(res.data);        
      },
      onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
      refetchOnWindowFocus: false,  // Window 聚焦时将再次 Refetch
      enabled: false  // RQ 查询默认自动运行， 禁止自动查询。
    } 
  );

  const { isLoading: isPuttingRecogn, mutate: putRecogn } = useMutation(
    async () => {
      return await apiClient.put(`/word/recogn`,  {
        list: putRecogData,
    })},
    {
      onSuccess: (res) => { setPostResult({status: 'success',res: res}) },
      onError: (err) => { setPostResult({status: 'error', res: err.response?.data || err});},
    }
  );

  const handlerNextWord = () => {
    setIndex(pre => pre + 1);
    putRecogn();  // Every time click this btn, put recognition to backeend
  }

  // Punch out，劳资打卡下班
  const handlerPunchOut = () => {
    console.log('收工... ')
  }

  // Load Data，execute once.
  useEffect( () => { getCognitionTopN()}, []);  

  useEffect( () => { setWordCurrent(data[index])}, [data, index]);

  useEffect(() => {
    if (isGettingCognitionTopN || isPuttingRecogn)  
      setPostResult({status:'pending',res:"posting..."});
  }, [isGettingCognitionTopN, isPuttingRecogn]);


  console.log('wordCurrent?.derivation', wordCurrent?.derivation)
  return(
    <>
      { index < data.length &&
        <>
          {wordCurrent && <WordPreview nextWordHandler={nextWordHandler} {...wordCurrent}  />}
          {wordCurrent?.derivation?.length && 
            <>
              <br /><hr /><br />
              <div className='text-sm text-slate-300'> derivation .. </div>
              {
                wordCurrent?.derivation.map(item => {
                  return <WordPreview nextWordHandler={nextWordHandler} {...item} key={item?._id}/>
                })
              }
            </>
          }
          {wordCurrent?.synonym ?.length && 
            <>
              <br /><hr /><br />
              <div className='text-sm text-slate-300'> synonym .. </div>
              {
                wordCurrent?.synonym.map(item => {
                  return <WordPreview nextWordHandler={nextWordHandler} {...item} key={item?._id}/>
                })
              }
            </>
          }
          <button className='next-btn' onClick={handlerNextWord}>
            <FaChevronRight />
          </button>
        </> 
      }

      <button 
        className='rounded-md bg-slate-200 border-2 shadow-emerald-800 p-2 m-2 w-full'
        onClick={handlerPunchOut}> 打卡下班 punch out 
      </button>
      <button onClick={putRecogn}>
        Put Recogn
      </button>
      
      <InfoShow {...postResult} />

    </>
  )
};
export default Main;
