import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { Download, Trash2 } from 'lucide-react'

const CreationItem = ({item, selected,selectionMode, onSelect, onDelete}) => {

    const [expanded, setExpanded] = useState(false)

    const downloadCreation = async () => {
        const isImage = item.type === 'image'
        const response = isImage ? await fetch(item.content) : null
        const blob = isImage
            ? await response.blob()
            : new Blob([item.content], { type: 'text/markdown' })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${item.prompt.slice(0, 40)}.${isImage ? 'jpg' : 'md'}`
        link.click()
        URL.revokeObjectURL(url)
    }

  return (
    <div className='w-full min-w-0 overflow-hidden p-4 max-w-5xl text-sm bg-[#e3cfe8] border border-gray-200 rounded-lg '>
      <div className='flex w-full items-center justify-between gap-4 min-w-0'>
        {selectionMode && (
            <input type="checkbox" checked={selected} onChange={(event) => {
                event.stopPropagation()
                onSelect(item.id) }} 
                className='shrink-0 cursor-pointer'
            />
        )}
        <div className='flex min-w-0 flex-1 items-center gap-4'>
            <button onClick={()=>setExpanded(!expanded)} className='w-32 shrink-0 whitespace-nowrap bg-[#fcebff] border border-[#9f50a2] text-[#9f50a2] px-2 py-1 rounded-full text-sm cursor-pointer hover:scale-105'>
                {item.type}
            </button>
            <div className='min-w-0 flex-1 text-left'>
                <h2 className='truncate max-w-[75%]' >{item.prompt}</h2>
                <p className='text-mauve-500 whitespace-nowrap'>{item.type} - {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
        </div>

        <button type="button" onClick={(event) => {
            event.stopPropagation()
            onDelete(item.id)}} className="text-fuchsia-800 cursor-pointer" >
            <Trash2 size={18} />
        </button>

      </div>

      <div>
        {expanded && (
                <>

                    <div>
                        {item.type === 'image'?(
                            <div>
                                <img src={item.content} alt="image" className='mt-3 w-full max-w-md' />
                            </div>
                        ):(
                            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-700'>
                                <div className='reset-tw'>
                                    <Markdown>{item.content}</Markdown>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={downloadCreation}
                        className="mt-3 flex items-center gap-2 text-fuchsia-900 cursor-pointer"
                    >
                        <Download size={18} />
                        Download
                    </button>
                </>              
            )}
      </div>

    </div>
  )
}

export default CreationItem