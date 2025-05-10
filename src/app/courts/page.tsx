"use client"
import { useSession } from 'next-auth/react'
import React from 'react'
import Courts from './courts';

export default function Page() {
  const user = useSession();
  console.log(user.data?.user)
  return (
    <div className='p-4'>
      <Courts complexId={user?.data?.user?.sportsComplexId ?? ""}/>
    </div>
  )
}
