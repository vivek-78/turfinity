"use client"
import { useSession } from 'next-auth/react'
import React from 'react'

export default function Page() {
  const user = useSession();
  return (
    <div>Dashboard - {user?.data?.user?.email}</div>
  )
}
