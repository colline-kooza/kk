"use client"
import { useSchool } from '@/components/providers/SchoolProvider'
import React from 'react'

export default function page() {
    const {school}=useSchool()
    // if (!school){
    //     return 
    // }
  return (
    <div className='h-screen bg-green-400 text-9xl'>{school?.name}</div>
  )
}
