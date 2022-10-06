import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import httpClient from "../api/http-common";
import { FaChevronRight } from 'react-icons/fa';
import SentencePrev from './SentencePrev';


const Setcs = () => {
  // console.log('Sects Components')
  const [index, setIndex] = useState(0);  // 页面顺序
  const [putData, setPutData] = useState();
  const [sentCurrent, setSentCurrent] = useState(null);
  const [sentList, setSentList] = useState(null);
  


  const fetchTopN = async () => {
    // const res = await fetch(`https://swapi.dev/api/planets/?page=${page}`)
    return await httpClient.get(`/sen/topN`)
  }

  const { data, isLoading, isError, isSuccess, } = useQuery ('get topN Sentences', fetchTopN, {
    // keepPreviousData: true,
    // refetchOnWindowFocus: true,  // Window 聚焦时将再次 Refetch
    enabled: true  // RQ 查询默认自动运行， 禁止自动查询。  
  })

  const handlerNextWord = () => {
    setIndex(pre => pre + 1);
    /* putRecogn();  // Every time click this btn, put recognition to backeend */
  }

  const handlerCalculate = () => {
    // calculate similarity
  }

  /* pass it to sub compo to get current sentence */ 
  const nextWordHandler = (res) => {
    setPutData(res);
  };

  useEffect(() => { 
    if(data){  
      setSentCurrent(data.data[index])  ;
      setSentList(data.data)
    }
  }, [data, index]);

  console.log('data',data)
  return(
    
    <div className='flex flex-col justify-center items-center'>
      {isLoading && <div>Loading...</div>}
      {isError &&   <div>Fetching error</div>}
      {(isSuccess && sentCurrent && (index < sentList?.length)) &&
        <>
        <SentencePrev nextWordHandler={nextWordHandler} index={index} {...sentCurrent}/> 
      

        <button className='w-4/6  h-10 m-1 p-1 bg-[#62b6cb] border-b-4 border-b-[#38a2c5] border-r-4 border-r-[#38a2c5] rounded-md text-[#1b4965] text-center  shadow-2xl '  
          onClick={handlerCalculate}>
          Calculate
        </button>

        <button className='w-4/6  h-10 m-1 py-1 bg-[#62b6cb] border-b-4 border-b-[#38a2c5] border-r-4 border-r-[#38a2c5] rounded-md text-[#1b4965] text-center shadow-lg '  onClick={handlerNextWord}>
          {/* <FaChevronRight  className='text-center'/> */}
          <div> 
            <span>Next</span> <FaChevronRight  className='inline text-center pb-[2px]'/>
          </div>
        </button>
        </>
    }
    {index === sentList?.length &&
      <>打卡</>
    }
    </div>
  )
}
export default Setcs;