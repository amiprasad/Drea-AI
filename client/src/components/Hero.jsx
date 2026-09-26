import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {

    const navigate = useNavigate()

  return (
    <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/src/assets/gradientBackground.png)] bg-cover br-no-repeat min-h-screen'>
      
      <div className='text-center mb-6'>
        <h1 className='text-2xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] '>
            Dream It Make It <br />with <span className='text-primary'>Drea AI</span>
        </h1>
        <p className=' mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-800'>From ideas to finished creations — Drea gives you the AI tools to write, create, transform, and perfect your work.</p>
      </div>

      <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs '>

        <button onClick={()=>navigate('/ai')} className='bg-[linear-gradient(49deg,#BF5C73,#6C5486)]  text-white px-7 py-3 rounded-3xl hover:scale-102 active:scale-95 transition-all duration-200 cursor-pointer'> Start Creating </button>

        <button className='bg-fuchsia-50 text-primary px-7 py-3 rounded-3xl border border-mauve-500 hover:scale-102 active:scale-95 transition cursor-pointer'> Watch demo </button>

      </div>

      <div className='flex items-center gap-4 mt-8 mx-auto text-gray-800'>
        <img src={assets.user_group} alt="" className='h-8'/> trusted by 10k+ people
      </div>

    </div>
  )
}

export default Hero
