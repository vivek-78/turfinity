"use client"
import React from 'react'
import { api } from '~/trpc/react'
import { CreateBooking } from './CreatingBooking'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card"

export default function CourtsList({ complexId }: { complexId: string }) {
    const { data: courts } = api.court.getCourtsByComplexId.useQuery({
        id: complexId
    })
    return (
        <div className='flex gap-3'>
            {courts?.map(c => {
                return (
                    <Card className="w-[200px]" key={c.id}>
                        <CardHeader>
                            <CardTitle>{c.name}{" "}({c.sport ?? ""})</CardTitle>
                        </CardHeader>
                        {/* <CardContent>
                            {c.sport}
                        </CardContent> */}
                        <CardFooter className="flex justify-between">
                            <CreateBooking courtId={c.id} />
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}
