import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { RiSendPlaneFill } from 'react-icons/ri'
import { search, thirdweb } from '../assets'
import { CountBox, CustomButton, DisplayCampaigns, Loader } from '../components'
import { useStateContext } from '../context'
import { calculateBarPercentage, daysLeft } from '../utils'
import CampaignLength from './CampaignLength'
import Sentiment from 'sentiment'
const Campaign = () => {
  const { state } = useLocation();
  const { donate, getDonations, contract, address, comm, getComments,getCampaigns } = useStateContext();
  const [IsLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState("");
  const [commentors, setCommentors] = useState([]);
  const [donators, setDonators] = useState([]);
  const [campaigns,setCampaigns]=useState([]);
  const [relatedCampaigns,setRelatedCampaigns]=useState([]);
  const [rate,setRate]=useState(0);
  const remainingdays = daysLeft(state.deadline);
  const fetchDonators = async () => {
    console.log("donators")
    const data = await getDonations(state.pId);
    setDonators(data);
  }

  const fetchCommentors = async () => {
    console.log("commentors")
    const d1 = await getComments(state.pId);

    setCommentors(d1);
  }
  const fetchCampaigns=async()=>{
    console.log("campaigns")
    const data=await getCampaigns();
    
    setCampaigns(data);
    console.log(data);
    const res=await fetch('http://localhost:8090/',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({
        pId:state.pId,
        dataset:data
      }),


    });
    
    const d=await res.json();
    console.log(d);
    setRelatedCampaigns(d);
  }




  useEffect(() => {
    if (contract) {
      fetchDonators();
      fetchCommentors();
      
      fetchCampaigns();
      

    }
    
  }, [contract, address])

  const handleComment = async (e) => {
    e.preventDefault();
    const score=new Sentiment().analyze(comment).score;

    await comm(state.pId, comment,score);
    window.location.reload();



  }


  const handleDonate = async () => {
    setIsLoading(true);
    await donate(state.pId, amount);
    navigate('/');
    setIsLoading(false);

  }

  const totalSentimentScore = commentors.reduce((acc, item) => {
    const score = new Sentiment().analyze(item.comment).score;
    return acc + score;
  }, 0);

  return (
    <div>{IsLoading && <Loader />}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingdays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white'>CREATOR</h4>
            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                <img src={thirdweb} className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{state.owner}</h4>
                <CampaignLength address={state.owner} />
              </div>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white'>STORY</h4>
            <div className='mt-[20px]'>
              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white'>DONATORS</h4>
            <div className='mt-[20px] flex flex-col gap-4'>
              {
                donators.length > 0 ? donators.map((item, index) => (
                  <div className='flex justify-between items-center gap-4' key={`${item.donator}-${index}`}>
                    <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all'>{index + 1}. {item.donator}</p>
                    <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-all'>{item.donation}</p>
                  </div>
                )) : (<p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No Donators yet.Be the first One!</p>)
              }




            </div>
          </div>

        </div>

        <div className='flex-1'>
          <h4 className='font-epilogue font-semibold text-[18px] text-white'>FUND</h4>
          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] '>
            <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>
              Fund the campaign
            </p>
            <div className='mt-[30px]'>
              <input
                type="number"
                placeholder='ETH 0.1'
                step="0.1"
                className='w-full py-[10px] sm:px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]'
                value={amount}
                onChange={(e) => setAmount(e.target.value)} />

            </div>
            <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
              <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
            </div>
            <CustomButton btnType="button" title="Fund Campaign" styles=" w-full bg-[#8c6dfd]" handleClick={handleDonate} />
          </div>
        </div>

      </div>

      <div className='my-7 flex-1'>
        <h4 className='font-epilogue font-semibold text-[18px] text-white'>COMMENTS</h4>
        <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px] border-[1px] border-[#3a3a43]'>
          <div className='flex flex-row w-full py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[10px] border-[1px] border-[#3a3a43]'>
            <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" placeholder='Write your comment here...' className='flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none' />
            <button onClick={handleComment} className='w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer'>
              <RiSendPlaneFill size={25} style={{ color: 'white' }} /></button>

          </div>
          <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>

            <div>
              
                {
                  commentors.length > 0 ? commentors.map((item) => (
                    
                    <div className='flex items-center gap-4 my-4' key={item.comment}>
                      <div className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer'>
                        <img src={thirdweb} className="w-[60%] h-[60%] object-contain" />
                      </div>
                      <div>
                      <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{item.comment}</h4>
                      <p className='font-epilogue mt-[4px] font-normal text-[12px] text-[#808191] break-all'>{item.Commentor}</p>
                      <div className="text-sm italic text-white">
                        
                        {new Sentiment().analyze(item.comment).score >= 0
                        ? <p>(Positive)✅ Score:({new Sentiment().analyze(item.comment).score})</p>
                        : <p>(Negative)❌ Score:({new Sentiment().analyze(item.comment).score})</p>}
                        
                          
                        
                        
                      </div>
                      </div>
                    </div>
                  )) : (<p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No Commentors yet. Be the first One!</p>)
                }

              
            </div>
          </div>

        </div>

      </div>

      <DisplayCampaigns title="Related Campaigns" isLoading={IsLoading} campaigns={relatedCampaigns}/>
    </div>
  )
}

export default Campaign
