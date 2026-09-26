import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets'
import { Gem, Sparkles, Trash2 } from 'lucide-react'
import { Show, useAuth } from '@clerk/react-router'
import CreationItem from '../components/CreationItem'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL; 

const Dashboard = () => {

  const [creations, setCreations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') 

  const { getToken } = useAuth()

  const getDashboardData = async () => {
    try {
      const {data} = await axios.get('/api/user/get-user-creations', {
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
        getDashboardData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  const filteredCreations = creations.filter((item) => {
    const matchesSearch = item.prompt
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesType =
      typeFilter === 'all' || item.type === typeFilter

    return matchesSearch && matchesType
  })

  const allSelected = filteredCreations.length > 0 && filteredCreations.every((item) => selectedIds.includes(item.id))

  return (
    <div className='h-full overflow-y-scroll p-6 bg-[#fff7ff] '>
      <div className='flex justify-start gap-4 flex-wrap'>

        {/* {total card} */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-pink-50 rounded-xl border border-[#9852aa]'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-tr-xl rounded-bl-xl rounded-sm bg-linear-to-br from-[#8c5fac] to-[#bd52bd] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white'/>
          </div> 
        </div>

        {/* {active card} */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-pink-50 rounded-xl border border-[#9852aa]'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'>
              <Show when={{ plan: 'premium' }} fallback='Free'>Premium</Show>
            </h2>
          </div>
          <div className='w-10 h-10 rounded-tr-xl rounded-bl-xl rounded-sm bg-linear-to-br from-[#ac5f6c] to-[#f284c8] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white'/>
          </div> 
        </div>

      </div>

      {
        loading ? 
        (
          <div className='flex justify-center items-center h-3/4'>
            <div className='animate-spin rounded-full h-11 w-11 border-3 border-primary border-t-transparent'></div>
          </div>
        )
        :
        (
          <div className='space-y-3'>
            <div className='flex justify-between items-center mt-6 mb-4 w-fit bg-[#e3cfe8] border border-[#9852aa] rounded-xl'>
              <p className='px-3 py-2 font-semibold text-gray-800'>
                Recent Creations

                {/* global check box */}
                <input type="checkbox" checked={allSelected} onChange={(event) => { 
                  const enabled = event.target.checked 
                  setSelectionMode(enabled)
                  setSelectedIds(enabled ? creations.map((item) => item.id) : []) 
                }} className="m-2 cursor-pointer" />

                <button type="button" disabled={selectedIds.length === 0} onClick={() =>   deleteCreations(selectedIds)} className="text-fuchsia-800 disabled:opacity-40 m-2 cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search creations"
                className="px-3 py-2 font-medium text-gray-800 bg-[#e3cfe8] border border-[#9852aa] rounded-lg cursor-pointer"
              />

              <select value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="px-3 py-2 font-medium text-gray-800 bg-[#e3cfe8] border border-[#9852aa] rounded-lg cursor-pointer">
                <div className='m-2'>
                  <option value="all">All types</option>
                  <option value="image">Images</option>
                  <option value="article">Articles</option>
                  <option value="blog-title">Blog Titles</option>
                  <option value="resume-review">Resume Reviews</option>
                </div>
              </select>
            </div>

            {
              filteredCreations.map((item)=> <CreationItem key={item.id} item={item} selected={selectedIds.includes(item.id)} selectionMode={selectionMode} onSelect={toggleSelected} onDelete={(id) => deleteCreations([id])}/>)
            }
          </div>
        )
      }

    </div>
  )
}

export default Dashboard
