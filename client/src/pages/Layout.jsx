import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn ,useUser } from '@clerk/react-router'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const {user} = useUser()

  return user? (
    <div className='flex flex-col items-start justify-start h-screen'>

      <nav className='relative z-10 w-full px-5 min-h-14 flex items-center justify-between bg-purple-50 border-b border-rose-50 shadow-[0_2px_8px_rgba(253,164,175,0.25)]'>
        <img src={assets.logo} alt="" onClick={() => navigate('/')} className='cursor-pointer w-32 sm:w-44 h-auto'/>
        {
          sidebar? <X onClick={()=>setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden'/>
          : <Menu onClick={()=>setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden'/>
        }
      </nav>
      <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar}/>
        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet/>
        </div>
      </div>

    </div>
  ) :
  <div className='flex items-center justify-center h-screen'>
    <SignIn/>
  </div>
}

export default Layout