import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/react-router'
import { ArrowUpRight } from 'lucide-react'

const AiTools = () => {

  const navigate = useNavigate()
  const {user} = useUser()

  return (
    <div className='px-4 sm:px-20 xl:px-32 py-20 bg-linear-to-br from-pink-50 via-indigo-50 to-purple-50'>
      
      <div className='text-center'>
        <h2 className='text-mauve-600 text-[42px] font-semibold'>Create without limits</h2>
        <p className='text-gray-500 max-w-lg mx-auto mt-1'>One workspace for writing, designing, enhancing and creating.</p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index)=>(
          <div key={index} className='p-7 m-3 w-full sm:w-75 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(191,92,115,0.10)] hover:-translate-y-1 hover:bg-white/50 hover:shadow-[0_12px_35px_rgba(191,92,115,0.18)] transition-all duration-300 cursor-pointer' onClick={()=> user && navigate(tool.path)}>
            <tool.Icon className='w-12 h-12 p-3 text-white rounded-xl' style={{background:`linear-gradient(to bottom, ${tool.bg.from}, ${tool.bg.to}`}}/>
            <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
            <p className='text-gray-500 text-sm max-w-[95%]'>{tool.description}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default AiTools
