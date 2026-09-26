import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <footer className="w-full bg-linear-to-b from-[#feeefe] to-[#f5edf6] text-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <img src={assets.logo} alt="logo" className='w-50 sm:w-60'/>
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    Empowering creators worldwide with the most advanced AI content creation tools. Transform your ideas
                    into reality.
                </p>
            </div>
            <div className="border-t border-slate-300">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">Drea AI ©2025. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer
