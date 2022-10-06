import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'

const Layout = (props) => {
  const navigate = useNavigate();
  console.log('url', props)
  const [tabValue, setTabValue] = useState('Word')
  const eee = (e) => {
    if(e.target.text){
      setTabValue(e.target.text?.trim());
    }
  }

  useEffect(()=>{
    navigate(`/${tabValue}`);
  },[tabValue]);

  return (

      <div className='container p-4 h-screen pb-4 flex flex-col justify-between'>

        {props.children}

        <div>
          <ul className="grid grid-cols-4 justify-between text-center gap-2 border-b-[2px] " onClick={(e) => eee(e) }>
            <li className="-mb-[2px] mr-1">
              <a className={`bg-white inline-block py-2 px-4 font-semibold 
                ${(tabValue === 'Word' ) ? 'text-[#1b4965] border-l-[2px] border-t-[2px] border-r-[2px] rounded-t ':
                      'text-[#62b6cb] hover:text-[#5fa8d3]'}`}>Word</a>
            </li>
            <li className="-mb-[2px] mr-1">
              <a className={`bg-white inline-block py-2 px-4 font-semibold 
                ${(tabValue === 'Setcs' ) ? 'text-[#1b4965] border-l-[2px] border-t-[2px] border-r-[2px] rounded-t':
                      'text-[#62b6cb] hover:text-[#5fa8d3]'}`}>Setcs</a>
            </li>
            <li className="-mb-[2px] mr-1">
            <a className={`bg-white inline-block py-2 px-4 font-semibold 
                ${(tabValue === 'Radio' ) ? 'text-[#1b4965] border-l-[2px] border-t-[2px] border-r-[2px] rounded-t':
                      'text-[#62b6cb] hover:text-[#5fa8d3]'}`}>Radio</a>
            </li>
            <li className="-mb-[2px] mr-1">
            <a className={`bg-white inline-block py-2 px-4 font-semibold 
                ${(tabValue === 'Set' ) ? 'text-[#1b4965] border-l-[2px] border-t-[2px] border-r-[2px] rounded-t':
                      'text-[#62b6cb] hover:text-[#5fa8d3]'}`}> Set </a>
            </li>
          </ul>
        </div>
      </div>
  )
}

export default Layout;