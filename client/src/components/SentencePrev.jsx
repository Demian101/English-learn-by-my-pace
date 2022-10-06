import { useState, useEffect } from 'react';
import { BsPinAngle } from "react-icons/bs";
import { GiSoundWaves } from "react-icons/gi";
import { FcElectricalSensor } from "react-icons/fc";
import axios from 'axios'

const useAudio = url => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);
  const toggle = () => setPlaying(!playing);
  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing] );
  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);
  return [playing, toggle];
};

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);
  return (
      // <button className='inline pr-2 text-xl rounded-md bg-slate-50 hover:bg-slate-100' onClick={toggle}>{playing ?  <GiSoundWaves /> :<FcElectricalSensor /> }</button>    
      <button className='absolute right-0 bottom-2 pr-3 text-2xl rounded-md ' onClick={toggle}>{playing ?  <GiSoundWaves /> :<FcElectricalSensor /> }</button>    
      );
};

const ColorPara = (props) => {
  // console.log('props', props)

  const getColor = () => {
    const colors = ['red', 'orange', 'green', 'blue']
    return 'green'
  }
  return (
    <p>
      {props.children.split(' ').map(text => {
        return <span className='text-base' 
                  style={{ color: getColor(), display: 'inline', }}
                  key={Math.random()}>{text}&nbsp;</span>
      })
      }
    </p>
  )
}

const SentencePrev = ({index, nextWordHandler, zh, en, label, words, _id}) => {
  const [inputs, setInputs] = useState();

  /*
  const ttsGenerate = async (e, text) => {
    console.log('ttsGenerate text', removeUnicode(text))
    const res = await axios.get(`http://127.0.0.1:8000/text2voice/?text=${text}`).then((res) => {
      console.log('res.data', res.data)
      return res.data
    }).catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log('error.response.data' ,error.response);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('error.request', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
    if(res){  return res  }
  }  */

  const submitText = (e) => {
    setInputs(e.target.value)
  }


  return (
    <>
      <div className='mb-2 italic text-2xl border-b border-b-[#62b6cb] text-[#5fa0b4] rounded-xl'>{index+1}</div>
      <div className='w-full text-left flex items-center'> <BsPinAngle className='inline pr-2 text-xl' /> {zh} </div>

      <form className="w-screen px-3 my-3 "
        onBlur={(e) => submitText(e)}>
        <textarea id="message" rows="3" className="w-full block p-4  text-gray-900 bg-gray-50 border-2 border-gray-300 shadow-lg px-3 py-2 rounded-lg focus:outline-none focus:border-[#62b6cb]" placeholder="Your message..."></textarea>
        {/* <input type="text" id="input-group-1" className="block bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" /> */}
      </form>
      {/* <div className='flex w-full py-2 font-semibold justify-between items-end' */}
      <div className='relative w-full py-2 font-semibold justify-between items-end'>
        {/* onClick={(e) => ttsGenerate(e, en)}>  */}
        <span className='inline'>{en} </span>
        <Player url={'http://localhost:8080/api/speech/62dda166046bc1cdbccff17019769b75/audio'} />
      </div>
      

      {
        words.map((word)=>{
          return (
          <ul key={word._id} className='w-full  py-2 text-xl'>
            <ColorPara eng={en} inputs={inputs}> i love you  </ColorPara>
            <hr />
            <div className='pt-2'>
              <li className='inline'>{word.word}</li> &nbsp;
              <span className='text-base text-slate-500 italic'>  {word?.soundmark}</span>
            </div>
            <li className='text-base pl-2 italic text-slate-500'>{word.rootOrAffix}</li>
            <li className='text-base pl-2'>{word.definition}</li>
            
            <li className='text-base pl-2 pt-2'>{word.ex1.zh} </li>
            <li className='text-base pl-2'>{word.ex1.en} </li>

            
          </ul>
          )
        })
      }
    </>
  )
}
export default SentencePrev;