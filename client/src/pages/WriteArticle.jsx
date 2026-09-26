import { Edit, Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react-router';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { downloadOutput } from '../utils/downloadOutput.js'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {

  const articlelength = [
    {length:500, text: 'Very Short (100-500 words)'},
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200+ words)'},
  ]

  const [selectedLength, setSelectedLength] = useState(articlelength[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e)=> {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post('/api/ai/generate-article', {prompt, length:selectedLength.length}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

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
      <form onSubmit={onSubmitHandler} className='w-full h-fit max-w-lg p-4 bg-pink-50 rounded-lg border border-[#9852aa]'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#6d50bb]'/>
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-600'>Article Topic</p>

        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md bg-[#fff7ff] border border-[#9852aa]' placeholder='hey there! again with new ideas? drop it here.' required/>

        <p className='mt-4 text-sm font-medium text-slate-600'>Article Length</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articlelength.map((item, index)=>(
            <span onClick={()=> setSelectedLength(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'border-[#9852aa] bg-purple-100 text-[#9852aa]' : 'text-gray-500 border-gray-500'} `} key={index} >
              {item.text}
            </span>
          ))}
        </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#652872] to-[#d55c9d] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className=' w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5'/>
          }
          Generate Article
        </button>
      </form>

      
      {/* {right col} */}
      <div className='w-full lg:w-[48%] max-w-lg p-4 bg-pink-50 rounded-lg flex flex-col border border-[#9852aa] min-h-96 max-h-150'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#6d50bb]'/>
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
              <Edit className='w-9 h-9'/>
              <p>Enter topic and click "Generate Article" to get started</p>
            </div>
          </div>
        ) : (
          <>
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>

          <button type="button" onClick={() => downloadOutput(content, 'article', false) .catch((error) => toast.error(error.message)) } className="mt-3 flex items-center gap-2 text-fuchsia-800 cursor-pointer">
            <Download size={18} />
            Download
          </button>
          </>
        )}

      </div>
  
    </div>
  )
}

export default WriteArticle
