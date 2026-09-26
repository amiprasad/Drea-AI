import React, { useEffect, useState } from 'react'
import { Heart ,Trash2, Download} from 'lucide-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { useUser } from '@clerk/react-router'
import { useAuth } from '@clerk/react-router';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; 

const Community = () => {

  const [creations, setCreations] = useState([])
  const {user} = useUser()
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [pendingLikeIds, setPendingLikeIds] = useState([])

  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      const {data} = await axios.get('/api/user/get-published-creations', {
      headers: {Authorization: `Bearer ${await getToken()}`}})
      
        if (data.success) {
          setCreations(data.creations)
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const downloadCreation = async (creation) => {
    try {
      const response = await fetch(creation.content)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `creation-${creation.id}.jpg`
      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const imageLikeToggle = async (id) => {
    if (!user || pendingLikeIds.includes(id)) return

    const creation = creations.find((item) => item.id === id)
    if (!creation) return

    const previousLikes = creation.likes
    const alreadyLiked = previousLikes.includes(user.id)
    const updatedLikes = alreadyLiked
      ? previousLikes.filter((userId) => userId !== user.id)
      : [...previousLikes, user.id]

    setPendingLikeIds((current) => [...current, id])
    setCreations((current) =>
      current.map((item) =>
        item.id === id ? { ...item, likes: updatedLikes } : item
      )
    )

    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creations',
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (!data.success) {
        setCreations((current) =>
          current.map((item) =>
            item.id === id ? { ...item, likes: previousLikes } : item
          )
        )
        toast.error(data.message)
        return
      }

      toast.success(data.message)
    } catch (error) {
      setCreations((current) =>
        current.map((item) =>
          item.id === id ? { ...item, likes: previousLikes } : item
        )
      )
      toast.error(error.message)
    } finally {
      setPendingLikeIds((current) => current.filter((likeId) => likeId !== id))
    }
  }

  const toggleSelected = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    )
  }

  const deleteCreations = async (ids) => {
    try {
      const { data } = await axios.delete('/api/user/delete-creations', {
        data: { ids },
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success(data.message)
        setSelectedIds([])
        setSelectionMode(false)
        fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if (user){
      fetchCreations()
    }
  },[user])

  const ownCreationIds = creations .filter((creation) => creation.user_id === user?.id).map((creation) => String(creation.id))

  const allSelected = ownCreationIds.length > 0 && ownCreationIds.every((id) => selectedIds.includes(id))

  return !loading ?(

    <div className='flex-1 h-full flex flex-col gap-3 bg-[#fff7ff] text-slate-700 p-6'>
      <div className="flex items-center gap-3">
        <p className="font-semibold">Creations</p>
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(event) => {
            const enabled = event.target.checked
            setSelectionMode(enabled)
            setSelectedIds(enabled ? ownCreationIds : [])
          }} className='cursor-pointer'
        />

        {selectionMode && (
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => deleteCreations(selectedIds)}
            className="text-fuchsia-800 disabled:opacity-40 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <div className='w-full h-full p-4 bg-[#faecff] rounded-lg border border-[#db9bea96] overflow-y-scroll'>
        {creations.map((creation, index)=> (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>

            {selectionMode && creation.user_id === user?.id && (
              <div className="relative z-20 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(String(creation.id))}
                  onChange={() => toggleSelected(String(creation.id))}
                  className='cursor-pointer'
                />

                <button
                  type="button"
                  onClick={() => deleteCreations([creation.id])}
                  className="text-fuchsia-800 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg'/>

            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-linear-to-b from-transparent to-black/80 text-white rounded-lg '>
              <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
              <div className='flex gap-1 items-center'>
                <p>{creation.likes.length}</p>
                <Heart onClick={()=> imageLikeToggle(creation.id)} className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`}/>
                <button type="button" aria-label="Download image" title="Download image" onClick={() => downloadCreation(creation)} className="cursor-pointer" >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ):(
    <div className='flex justify-center items-center h-full bg-[#fff7ff]'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community