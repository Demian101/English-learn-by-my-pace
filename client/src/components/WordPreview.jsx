import React, { useEffect, useState } from "react";
import MultiBtn from './MultiBtn';

// 注意这里，{word, rootOrAffix, soundmark} 是获取 API 后异步传入的，而 UI 渲染是同步的
// ？？？？ nextWordHandler 也被解构出来了... 为啥... 
const WordPreview = ({nextWordHandler, word, rootOrAffix, definition, soundmark, ex1, ex2, ex3 }) => {
  // console.log('拿到值之后再渲染本组件，',word )
  const [defishow, setDefishow] = useState(true);
  const [soundshow, setSoundshow] = useState(false);
  const [ex1show, setEx1show]= useState(false);
  const [ex2show, setEx2show]= useState(false);
  const [ex3show, setEx3show]= useState(false);

  const [soundmark_, setSoundmark_] = useState(soundmark);
  const [rootOrAffix_, setRootOrAffix_] = useState(rootOrAffix);
  const [definition_, setDefinition_] = useState(definition);
  const [ex1En,setEx1En] = useState(ex1?.en);
  const [ex1Zh,setEx1Zh] = useState(ex1?.zh);

  /* attriRecog 是这种形式 ：
  Array (6)[
    0 {word: {name: "interpret", delta: 0}}
    1 {definition: {name: "vi. 解释；翻译", delta: 0}}
    2 {soundmark: {name: "/in'tə:prit/", delta: 0}}
    3 {ex1: {name: {cognition: 0, en: "She interpret his silence as arrogance", zh: "她把他的沉默解释为傲慢。"}, delta: 0}}
    4 {ex2: {name: {cognition: 0, en: "", zh: ""}, delta: 0}}
    5 {ex3: {name: {cognition: 0, en: "", zh: ""}, delta: 0}}
  */

  let newState = [];
  // 遍历 lisobj，不为空的放到 newState 里面传入 attriRecog
  // attriRecog 经过用户的认知度修改后，会再度传给父组件。
  const lisobj = {word, rootOrAffix, definition, soundmark, ex1, ex2, ex3}
  Object.keys(lisobj).forEach( k => {
    if(lisobj[k]) { 
      let tmp = { name: lisobj[k], delta: 0 } 
      newState.push({[k]: tmp})
      // newState['delta'] = 0
    }
  })
  const [attriRecog, setAttriRecog] = useState(newState);

  const setAttr = (attr, val) => {
    attriRecog.forEach( item => {
      const k1 =  Object.keys(item)[0]
      if(attr===k1){
        item[k1] = val
      }
    } )
    if(attr === 'soundmark') {setSoundmark_(val)}
    if(attr === 'rootOrAffix') {setRootOrAffix_(val)}
    if(attr === 'definition') {setDefinition_(val)}
  }

  const setExample = () => {
    
  }

  // 向 <Main /> 传递 recognition 信息
  useEffect(()=> {
    nextWordHandler(attriRecog);
  }, [attriRecog])

  useEffect(()=>{
    setDefishow(true); setSoundshow(false); setEx1show(false); setEx2show(false);  setEx3show(false);
  },[word]);

  // 设置 button 点选后的认知度偏移：不认识 -1， 模糊不变，认识则 +1
  const getChildrenValue = (name, val) => {
    console.log('getChildrenValue name, val', name, val)
    let recog = 0;
    if (val === 'mastered') { recog += 1 } 
    if (val === 'forgetful'){ recog -= 1 }
    const newState = attriRecog.map(obj=>{
      if ( Object.keys(obj)[0] == name) { return {...obj, delta: recog}}
      return obj
    })
    setAttriRecog(newState);

    // 按需依次展示
    if (name === 'definition'){ setDefishow(false); setSoundshow(true) }
    if (name === 'soundmark'){ setSoundshow(false); setEx1show(true)}
    if (name === 'ex1'){ setEx1show(false); setEx2show(true)}
    if (name === 'ex2'){ setEx2show(false); setEx3show(true)}
    if (name === 'ex3'){ setEx3show(false);}
  };
  console.log('attriRecog..', attriRecog)

  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();   // 阻止 submit 提交后自动 flush 页面
    setIsEditing((prevalue) => !prevalue);
    // ....
    // 撰写 submit 逻辑。
    // ....
  };
  const onClickHandler = (e) => {
    e.preventDefault();
    setIsEditing((prevalue) => !prevalue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex justify-between'>
        <div>
          <span className='text-2xl '> {word} </span>  
          {(!soundshow && !defishow) && <input type='text' disabled={!isEditing} value={soundmark_} onChange={(e) => setAttr('soundmark',e.target.value)}/>}
        </div>
        {/* 2 buttons  */}
        { isEditing ? (
          <button type='submit'
            className='rounded-md bg-cyan-100 px-2 py-1 m-1 hover:bg-zinc-300'
            onSubmit={handleSubmit}
          > submit </button>
        ) : (
          <button type='submit'
            className='border-2 px-2 mx-2 rounded-md hover:bg-zinc-200'
            onClick={onClickHandler}
          > edit </button>
        )}
      </div> {/*  【word、音标】   【edit 按钮】  */}
      {rootOrAffix && <input type='text' disabled={!isEditing} value={rootOrAffix_} onChange={(e) => setAttr('rootOrAffix',e.target.value)}/>}

      {(defishow && definition) &&
          <div className='flex justify-between bg-yellow-100'>
            <div className='text-center'> Definition： </div>
            <MultiBtn name={'definition'} getValue={getChildrenValue} />
          </div>
      }
      {(!defishow && definition) && 
        <input type='text' disabled={!isEditing} value={definition_} onChange={(e) => setAttr('definition',e.target.value)}/>
      }

      {(soundshow && soundmark) &&
        <div className='flex justify-between bg-yellow-100'>
          <div> soundmark： </div>
          <MultiBtn name={'soundmark'} getValue={getChildrenValue} />
        </div>  
      }
      

      { (ex1show && ex1?.zh) &&
        <div className='flex justify-between bg-yellow-100'>
          <span> {ex1?.zh} </span>
          <MultiBtn name={'ex1'} getValue={getChildrenValue} />
        </div>
      }
      {(!ex1show && !soundshow && !defishow) && 
        <>
          <div> {ex1?.zh} </div>
          <div> {ex1?.en} </div>
        </> }

      {(ex2show && ex2?.zh) && 
        <div className='flex justify-between bg-yellow-100'>
          <div> {ex2?.zh} </div>
          <MultiBtn name={'ex2'} getValue={getChildrenValue} />
        </div>
      }
      {(!ex2show && !soundshow && !defishow && !ex1show) && 
        <>
          <div> {ex2?.zh} </div>
          <div> {ex2?.en} </div>
        </> }

      {(ex3show && ex3?.zh) &&
        <div className='flex justify-between bg-yellow-100'>
          <div> {ex3?.zh} </div>
          <MultiBtn name={'ex3'} getValue={getChildrenValue} />
        </div>
      }
      {(!ex3show && !soundshow && !defishow && !ex1show && !ex2show) &&
        <>
          <div> {ex3?.zh} </div>
          <div> {ex3?.en} </div>
        </>
      }
      {/* <PutRecognition /> */}
    </form>
  )
}
export default WordPreview;

/*
{ attriRecog.map( obj => {
    const key_ = Object.keys(obj)[0];
    // console.log('obj[key_]....', obj[key_]);
    return(
      obj[key_] && 
        <div key={key_} className='flex justify-between bg-yellow-100'>
          <div> {obj[key_]} </div>
          <MultiBtn name={key_} attri={obj[key_]} getValue={getChildrenValue} />
        </div>
    )
  })}
*/