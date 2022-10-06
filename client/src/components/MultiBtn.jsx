import React, { useCallback, useContext, useEffect, useState } from "react";


const MultiBtn = ({name, getValue}) => {

  const clickHandler = (name, val) =>{
    console.log('name,val', name, val)
    getValue(name, val);
  }

  return(
    <div className=' bg-slate-200 inline-block'>
      <button className='rounded-md hover:bg-slate-400 p-1 m-1' 
        onClick={(e) => clickHandler(name,'mastered')}>掌握</button>
      <button className='rounded-md hover:bg-slate-400 p-1 mx-1' 
        onClick={(e) => clickHandler(name,'perplexed')}>模糊</button>
      <button className='rounded-md hover:bg-slate-400 p-1 mx-1' 
        onClick={(e) => clickHandler(name,'forgetful')}>忘记</button>
    </div>
  )
}

export default MultiBtn;