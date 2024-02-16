import React, { useEffect, useState } from 'react'
import {useStateContext} from '../context'


const CampaignLength = ({address}) => {
  const [campaigns,setCampaigns]=useState([]);
  const {contract,getUserCampaignsLength}=useStateContext();

  const fetchCampaigns=async()=>{

    const data=await getUserCampaignsLength(address);
    const camp=data+" campaigns"
    setCampaigns(camp);

  }
  useEffect(()=>{
    if(contract) fetchCampaigns();
  },[address,contract]);
  return (
    <div>
      <p className='font-epilogue mt-[4px] font-normal text-[12px] text-[#808191]'>{campaigns}</p>
    </div>
  )
}

export default CampaignLength