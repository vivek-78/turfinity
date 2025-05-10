"use client"
import { useSession } from 'next-auth/react';
import React from 'react'
import { FormProvider } from 'react-hook-form';
import { Form } from '~/components/ui/form';
import { api } from '~/trpc/react'

export default function Page({id}:{id: string}) {
    const session = useSession();
    const {data: courtDetails } = api.court.getCourtDetailsById.useQuery({ id });
    const { data: inventory} = api.inventory.getAllInventoryItems.useQuery({ sportsComplexId: session?.data?.user?.sportsComplexId ?? "" })
  return (
    <div>
    </div>
  )
}
