import { useAuth } from '@clerk/react-router';
import { Hash,  Sparkles, Download } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios'
import { downloadOutput } from '../utils/downloadOutput.js'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {

const blogCategories = ['General', 'Technology', 'Business', 'Health', 'lyfestyle', 'Education', 'Travel', 'Food']

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e)=> {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Ganerate a blog title for the keyword ${input} in the category ${selectedCategory}`

      const {data} = await axios.post('/api/ai/generate-blog-title', {prompt}, {
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
      <form onSubmit={onSubmitHandler} className='w-full h-fit max-w-lg p-4 bg-pink-50 rounded-lg border border-[#bb506b]'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#bb506b]'/>
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-600'>Keyword</p>

        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md bg-[#fff7ff] border border-[#bb506b]' placeholder='hey there! again with new ideas? drop it here.' required/>

        <p className='mt-4 text-sm font-medium text-slate-600'>Category</p>

        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {blogCategories.map((item)=>(
            <span onClick={()=> setSelectedCategory(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'border-[#bb506b] bg-rose-100 text-[#bb506b]' : 'text-gray-500 border-gray-500'} `} key={item} >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-linear-to-r from-[#873945] to-[#e76984] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className=' w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Hash className='w-5'/>
          }
          Generate Title
        </button>
      </form>

      
      {/* {right col} */}
      <div className='w-full lg:w-[48%] max-w-lg p-4 bg-pink-50 rounded-lg flex flex-col border border-[#bb506b] min-h-96 max-h-150'>
        <div className='flex items-center gap-3'>
          <Hash className='w-5 h-5 text-[#bb506b]'/>
          <h1 className='text-xl font-semibold'>Generated Titles</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
              <Hash className='w-9 h-9'/>
              <p>Enter topic and click "Generate Title" to get started</p>
            </div>
          </div>
        ) : (
          <>
          <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>

          <button type="button" onClick={() => downloadOutput(content, 'blog-titles', false) .catch((error) => toast.error(error.message)) } className="mt-3 flex items-center gap-2 text-fuchsia-800 cursor-pointer">
            <Download size={18} />
            Download
          </button>
          </>
        )}

      </div>
  
    </div>
  )
}

export default BlogTitles
