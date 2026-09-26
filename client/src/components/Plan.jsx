import React from 'react'
import {PricingTable} from '@clerk/react-router'

const Plan = () => {
  return (
    <div className='max-w-full mx-auto z-20 py-20 bg-linear-to-br from-purple-50 via-pink-50 to-indigo-50'>

      <div className='text-center'>
        <h2 className='text-mauve-600 text-[42px] font-semibold '>Choose Your Plan</h2>
        <p className='text-gray-500 max-w-lg mx-auto mt-1'>Start for free and scale up as you grow. Find the perfect plan for your content creation needs.</p>
      </div>

      <div className='mt-14 px-4 sm:px-20 xl:px-32'>
        <PricingTable/>
      </div>

    </div>
  )
}

export default Plan
