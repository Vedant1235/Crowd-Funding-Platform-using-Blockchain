import React,{ useContext,createContext, useState } from "react";
import {useAddress,useContract,useMetamask,useContractWrite,useContractMetadata} from '@thirdweb-dev/react';
import {ethers} from 'ethers';

const StateContext=createContext();
export const StateContextProvider=({children})=>{
    const {contract} =useContract('0x2eb013BCdA86660d95348d89AC17a0a432016F97');
    
    const {mutateAsync:createCampaign}=useContractWrite(contract,'create');
    const address=useAddress();
    const connect=useMetamask();
    const [searchQuery, setSearchQuery] = useState("");
    const publishCampaign=async(form)=>{
        try {
            const data=await createCampaign([
                address,
                form.title,
                form.description,
                form.category,
                form.target,
                
                new Date(form.deadline).getTime(),
                form.image,
                
            ])
            console.log("Contract Call Success",data);
        } catch (error) {
            console.log("Contract Failure",error);
        }
    }
    const getUserCampaigns=async()=>{
        const allCampaigns=await getCampaigns();
        const filteredCampaigns=allCampaigns.filter((campaign)=>campaign.owner===address)
        return filteredCampaigns;
    }
    const getUserCampaignsLength=async(addr)=>{
        const allCampaigns=await getCampaigns();
        const filteredCampaigns=allCampaigns.filter((campaign)=>campaign.owner===addr)
        
        return filteredCampaigns.length;
    }
    const getCampaigns=async()=>{
        const campaigns=await contract.call('getCampaigns');
        // console.log(campaigns);
        const parsedCampaigns=campaigns.map((campaign,i)=>({
            owner:campaign.owner,
            title:campaign.title,
            description:campaign.description,
            category:campaign.category,
            target:ethers.utils.formatEther(campaign.target.toString()),
            deadline:campaign.deadline.toNumber(),
            amountCollected:ethers.utils.formatEther(campaign.amountCollected.toString()),
            rating:campaign.rating.toNumber(),
            image:campaign.image,
            pId:i
        }))
        return parsedCampaigns;
    }
    const donate=async(pId,amount)=>{
        const data=await contract.call('donate',pId,{
            value:ethers.utils.parseEther(amount)
        });
        return data;
    }

    const comm=async(pId,com,score)=>{
        const d=await contract.call('NewComment',pId,com,score);
        return d;
    }

    const getDonations=async(pId)=>{
        const donations=await contract.call('getDonators',pId);
        const numberOfDonations=donations[0].length;
        const parsedDonations=[];
        for(let i=0;i<numberOfDonations;i++){
            parsedDonations.push(
                {
                    donator:donations[0][i],
                    donation:ethers.utils.formatEther(donations[1][i].toString())
                }
            )
        }
        return parsedDonations;
    }

    const getComments=async(pId)=>{
        const comms=await contract.call('getComments',pId);
        const numberOfComms=comms[0].length;
        const parsedComms=[];
        for(let i=0;i<numberOfComms;i++){
            parsedComms.push(
                {
                    Commentor:comms[0][i],
                    comment:comms[1][i]
                }
            )
        }
        return parsedComms;
    }


    return <StateContext.Provider
    value={{address,contract,connect,createCampaign:publishCampaign,getCampaigns,getUserCampaigns,donate,getDonations,getUserCampaignsLength,comm,getComments,searchQuery,setSearchQuery}}>{children}</StateContext.Provider>
}
export const useStateContext=()=>useContext(StateContext);