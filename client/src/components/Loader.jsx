import React from 'react'
import { loader } from '../assets'
const Loader = () => {
  return (
    <div className='fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)]
    flex items-center justify-center flex-col'>
        <img src={loader} className="w-[100px] h-[100px] object-contain" alt="loader" />
        <p className='mt-[20px] text-white font-epilogue font-bold text-[20px] text-center'>
            Transaction in Progress <br/>Please Wait...
        </p>
    </div>
  )
}

export default Loader