import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {ethers} from 'ethers';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import {checkIfImage} from '../utils';
import { useStateContext } from '../context';
const CreateCampaign = () => {
  const navigate=useNavigate();
  const [isLoading,SetIsLoading]=useState(false);
  const {createCampaign}=useStateContext();
  const [form, setForm]=useState({
    name:'',
    title:'',
    description:'',
    category:'',
    target:'',
    deadline:'',
    image:''
  })
  const handleFormFieldChange=(fieldName,e)=>{
    setForm({...form,[fieldName]:e.target.value})
  }
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    checkIfImage(form.image,async(exists)=>{
      if(exists){
        await createCampaign({...form,target:ethers.utils.parseUnits(form.target,18)})
        SetIsLoading(false);
        navigate('/')
      }
      else{
        alert('Provide Valid Image URL');
        setForm({...form,image:''});
      }
    })
    
  }
  return (

    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader/>}
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epologue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a Campaign</h1>
      </div>
      <form className='w-full mt-[65px] flex flex-col gap-[30px]' onSubmit={handleSubmit}>
        <div className='flex flex-wrap gap-[40px]'>
          <FormField
          labelName="Your Name *"
          placeholder="John Doe"
          inputType="text"
          value={form.name}
          handleChange={(e)=>handleFormFieldChange('name',e)}/>

          <FormField
          labelName="Campaign Title *"
          placeholder="Write a title"
          inputType="text"
          value={form.title}
          handleChange={(e)=>handleFormFieldChange('title',e)}/>

          <FormField
          labelName="Select a category *"
          placeholder="Select"
          isSelect
          value={form.category}
          handleChange={(e)=>handleFormFieldChange('category',e)}
          />
        </div>
<FormField
          labelName="Story *"
          placeholder="Write a story"
          isTextArea
          value={form.description}
          handleChange={(e)=>handleFormFieldChange('description',e)}/>
        <div className='flex flex-wrap gap-[40px]'>
          <FormField
          labelName="Goal *"
          placeholder="ETH 0.50"
          inputType="text"
          value={form.target}
          handleChange={(e)=>handleFormFieldChange('target',e)}/>

          <FormField
          labelName="End Date *"
          placeholder="End Date"
          inputType="date"
          value={form.deadline}
          handleChange={(e)=>handleFormFieldChange('deadline',e)}/>
</div>

          <div>
            <FormField
          labelName="Campaign Image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e)=>handleFormFieldChange('image',e)}/>

          <div className='flex justify-center items-center mt-[40px]'>
            <CustomButton btnType="submit"
            title="Submit New Campaign"
            styles="bg-[#1dc071]"/>
          </div>
          </div>
        
      </form>
    </div>
    
  )
}

export default CreateCampaign