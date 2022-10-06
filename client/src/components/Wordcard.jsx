import React, { useState, useEffect, useRef } from "react";
import useAutosizeTextArea from "../hooks/useAutosizeTextArea";

const Wordcard = ({wordObj}) => {
  // console.log('wordObj :',wordObj)
  const [word, setWord] = useState(wordObj);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);

  const textAreaRef = useRef(null);
  useAutosizeTextArea(textAreaRef.current, word.definition, isEditing);

  const textAreaRef2 = useRef(null);
  useAutosizeTextArea(textAreaRef2.current, word.exapmple, isEditing);

  const handleSubmit = (e) => {
    e.preventDefault(); // 阻止 submit 提交后自动 flush 页面
    // console.log("Invoke handleSubmit , word.word", word);
    // setEditID(null);  // Edit 状态回到 false
    setIsEditing((prevalue) => !prevalue);
  };

  const onClickHandler = (e) => {
    e.preventDefault();
    setIsEditing((prevalue) => !prevalue);
  };

  const handleDefinitionChange = (e) => {
    const val = e.target?.value;
    setWord({ ...word, definition: val });
  };
  const handleExampleChange = (e) => {
    const val = e.target?.value;
    setWord({ ...word, exapmple: val });
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div>
          <input type='text' disabled={!isEditing}
            className='block w-full font-bold text-2xl bg-white border-0 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-slate-200 focus:border-purple-500'
            value={word.word}
            onChange={(e) => {
              setWord((oldvalue) => ({ ...oldvalue, word: e.target.value }));
            }}
          />
        </div>

        <div>
          <input type='text' disabled={!isEditing}
            className='block w-full text-slate-500 bg-white italic  border-gray-200 rounded py-2 px-4  leading-tight focus:outline-none focus:bg-slate-200 focus:border-purple-500'
            value={word.soundmark}
            onChange={(e) => {
              setWord((oldvalue) => ({ ...oldvalue, soundmark: e.target.value,
              }));
            }}
          />
        </div>

        {
          wordObj?.rootOrAffix && (
            <div> 
              <input type='text' disabled={!isEditing}
                className='block w-full text-slate-500 bg-white italic  border-gray-200 rounded py-2 px-4  leading-tight focus:outline-none focus:bg-slate-200 focus:border-purple-500'
                value={word.rootOrAffix}
                onChange={(e) => {
                  setWord((oldvalue) => ({ ...oldvalue, rootOrAffix: e.target.value,
                  }));
                }
              }/>
            </div> )
        }

        { isEditing ? (
          <div>
            <textarea
              className='block w-full resize pl-4 focus:bg-slate-100 focus:border-purple-500'
              onClick={handleDefinitionChange}
              onChange={handleDefinitionChange}
              placeholder='What did you like or dislike?'
              ref={textAreaRef}
              // rows={1}
              value={word.definition}
            />{" "}
          </div>
        ) : (
          // whitespace-pre 保留换行
          <div className='block w-full whitespace-pre pl-4'>{word.definition}</div>
        )}

        <hr className='border-gray-200' />

        { isEditing ? (
          <div>
            <textarea
              className='resize block w-full pl-4 focus:bg-slate-100 focus:border-purple-500'
              onClick={handleExampleChange}
              onChange={handleExampleChange}
              placeholder='What did you like or dislike?'
              ref={textAreaRef2}
              // rows={1}
              value={word.exapmple}
            />{" "}
          </div>
        ) : (
          <div className='whitespace-pre pl-4'>{word.exapmple}</div>
        )}


        {/* 2 buttons  */}
        { isEditing ? (
          <button
            type='submit'
            className='border-2 px-2 mx-2 rounded-md hover:bg-zinc-300'
            onSubmit={(e) => handleSubmit(e)}
          >
            submit
          </button>
        ) : (
          <button
            type='submit'
            className='border-2 px-2 mx-2 rounded-md hover:bg-zinc-200'
            onClick={onClickHandler}
          >
            edit
          </button>
        )}
      </form>
    </section>
  );
};

export default Wordcard;
