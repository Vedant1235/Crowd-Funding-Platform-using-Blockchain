import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {CustomButton} from './';
import {logo, menu, search,thirdweb} from'../assets';
import {navlinks} from '../constants';
import { useStateContext } from '../context';
const Navbar = () => {
  const navigate=useNavigate();
  const[isActive,setIsActive]=useState('dashboard');
  const {connect,address,setSearchQuery,searchQuery}=useStateContext();
  const [Toggle, setToggle] = useState(false);
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);

  };
  return (
    <div className='flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6'>
      <div className='lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[20px]'>
        <input value={searchQuery} onChange={handleSearchInputChange} type="search" placeholder='Search for campaigns' className='flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none'/>
        <div className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'>
          <img  src={search} alt="search" className='w-[15px] h-[15px] ' /></div>

      </div>
      <div className='sm:flex hidden flex-row justify-end gap-4'>
        <CustomButton 
        btnType="button" 
        title={address? 'Create a campaign':'Connect'} 
        styles={address?'bg-[#1dc071]':'bg-[8c6dfd]'} 
        handleClick={
          ()=>{
            if(address) 
            navigate('create-campaign') 
            else connect();
            }
            }
            />
            <Link to="/profile">
              <div className='w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
                <img src={thirdweb} className='w-[60%] h-[60%] object-contain'/>
              </div>
            </Link>
      </div>

      <div className='sm:hidden flex justify-between items-center relative'>
      <div className='w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer'>
          <img src={thirdweb} className='w-[60%] h-[60%] object-contain'/>
      </div>
      <img src={menu} className="w-[34px] h-[34px] object-contain cursor-pointer"
      onClick={()=>setToggle(!Toggle)}/>
      </div>
      <div className={`sm:hidden absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary my-4 py-4 mx-4 rounded-[10px] ${!Toggle ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
        <ul className='mb-4'>
          {navlinks.map((links)=>(
            <li key={links.name}
            className={`flex p-4 ${isActive===links.name && 'bg-[#3a3a43]'}`}
            onClick={
              ()=>{
                setIsActive(links.name);
                setToggle(false);
                navigate(links.link);
              }
            }>
            <img src={links.imgUrl}
            alt={links.name}
            className={`w-[24px] h-[24px] object-contain ${isActive===links.name?'grayscale-0':'grayscale'}`}/>
            <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive===links.name?'text-[#1dc071]':'text-[#808191]'}`}>{links.name}</p>
            
            </li>
            
          ))}
          
        </ul>
        <div className='flex mx-4'>
        <CustomButton 
        btnType="button" 
        title={address? 'Create a campaign':'Connect'} 
        styles={address?'bg-[#1dc071]':'bg-[8c6dfd]'} 
        handleClick={
          ()=>{
            if(address) 
            navigate('create-campaign') 
            else connect();
            }
            }
            />
        </div>
      </div>
    </div>
  )
}

export default Navbar