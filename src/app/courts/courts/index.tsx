import React from 'react'
import { AddCourt } from './AddCourts'
import CourtsList from './Courts'

export default function Courts({complexId}:{ complexId: string}) {
  return (
    <div className='flex gap-3'>
        <CourtsList complexId={complexId} />
        <AddCourt complexId={complexId}/>
    </div>
  )
}
