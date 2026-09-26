import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {useClerk, UserButton, useUser} from '@clerk/react-router'

const Navbar = () => {

    const navigate = useNavigate()
    const {user} = useUser()
    const {openSignIn} = useClerk()

  return (
    <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-2 px-3 sm:px-20 xl:px-32 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'>
      <img src={assets.logo} alt="logo" className='w-32 sm:w-44 cursor-pointer ' onClick={() => navigate('/')}/>

      {
        user? <UserButton/>
        :
        (
          <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5 hover:shadow-[0_0_20px_rgba(191,92,115,0.35)] transition-shadow duration-200'>Get Started <ArrowRight className='w-4 h-4'/></button>
        )
      }

    </div>
  )
}

export default Navbar

// shadow-[0_0_20px_rgba(191,92,115,0.35)]