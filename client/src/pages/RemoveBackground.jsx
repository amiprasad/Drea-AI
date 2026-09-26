import { Eraser, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react-router';
import toast from 'react-hot-toast';
import { downloadOutput } from '../utils/downloadOutput.js'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; 

const RemoveBackground = () => {


  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e)=> {
    e.preventDefault();
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', input)

      const {data} = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
        toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start bg-[#fff7ff] flex-wrap gap-4 text-slate-700'>
      {/* {left col} */}
      <form onSubmit={onSubmitHandler} className='w-full h-fit max-w-lg p-4 bg-pink-50 rounded-lg border border-[#32509b]'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#32509b]'/>
          <h1 className='text-xl font-semibold'>Background Remover</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-600'>Upload Image</p>

        <input onChange={(e)=>setInput(e.target.files[0])} type="file" accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md bg-[#fff7ff] border border-[#32509b] text-grey-600' placeholder='hey there! wanna remove something?' required/>

        <p className='mt-1 text-xs font-light text-slate-700'>supports JPG, PNG and other image formats</p>

        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#32509b] to-[#9369ac] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className=' w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Eraser className='w-5'/>
          }
          Remove Background
        </button>
      </form>

      
      {/* {right col} */}
      <div className='w-full lg:w-[48%] max-w-lg p-4 bg-pink-50 rounded-lg flex flex-col border border-[#32509b] min-h-96 max-h-150'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#32509b]'/>
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
                <Eraser className='w-9 h-9'/>
                <p>Upload image and click "Remove Background" to get started</p>
              </div>
            </div>
          ) : (
            <>
            <img src={content} alt="image" className='mt-3 w-full h-full' />

            <button type="button" onClick={() => downloadOutput(content, 'remove-image-background', true) .catch((error) => toast.error(error.message)) } className="mt-3 flex items-center gap-2 text-fuchsia-800 cursor-pointer">
              <Download size={18} />
              Download
            </button>
            </>
          )
        }

      </div>
  
    </div>
  )
}

export default RemoveBackground
