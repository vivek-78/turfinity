"use client"
import type { ColumnDef } from '@tanstack/react-table';
import type { inferRouterOutputs } from '@trpc/server';
import { differenceInMinutes, format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'
import { DataTable } from '~/components/custom/data-table';
import { Button } from '~/components/ui/button';
import { Skeleton } from '~/components/ui/skeleton';
import type { AppRouter } from '~/server/api/root';
import { api } from '~/trpc/react';
import { CloseBooking } from './components/CloseBooking';
type CourtBookingsType = inferRouterOutputs<AppRouter>["bookings"]["getbookingsByComplexId"][number];
function minutesToHHMMSS(minutes: number) {
  const totalSeconds = Math.floor(minutes * 60);
  const baseDate = new Date(0); // Epoch
  const dateWithTime = new Date(baseDate.getTime() + totalSeconds * 1000);
  return format(dateWithTime, 'HH:mm:ss');
}
const bookingColumns: ColumnDef<CourtBookingsType>[] = [
  {
    accessorKey: "court.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Court Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-md pl-3.5">
        {row?.original?.court?.name}
      </p>
    )
  },
  {
    accessorKey: "courtBookings.startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Start
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-md pl-3.5">
        {row.original.courtBookings?.startTime
          ? format(row.original.courtBookings.startTime, "dd-MMM-yyyy HH:mm a")
          : "--"}
      </p>
    )
  },
  {
    accessorKey: "courtBookings.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Player Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-md pl-3.5">
        {row?.original?.courtBookings?.name}
      </p>
    )
  },
  {
    accessorKey: "courtBookings.startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Closed On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-md pl-3.5">
        {row.original.courtBookings?.endTime
          ? format(row.original.courtBookings.endTime, "dd-MMM-yyyy HH:mm a")
          : "--"}
      </p>
    )
  },
  {
    accessorKey: "courtBookings.startTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-md pl-3.5">
        {row?.original?.courtBookings?.status === "completed" &&
          row?.original?.courtBookings?.startTime &&
          row?.original?.courtBookings?.endTime &&
          minutesToHHMMSS(differenceInMinutes(row?.original?.courtBookings?.startTime, row?.original?.courtBookings?.endTime))
        }
        {row?.original?.courtBookings?.status === "ongoing" &&
          row?.original?.courtBookings?.startTime &&
          minutesToHHMMSS(differenceInMinutes(row?.original?.courtBookings?.startTime, new Date()))
        }
      </p>
    )
  },
  {
    accessorKey: "court.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-md pl-3.5 capitalize">
        {row?.original?.courtBookings?.status ?? "--"}
      </p>
    )
  },
]
export default function Page() {
  const user = useSession();
  const { data: bookings, isLoading: bookingLoading } = api.bookings.getbookingsByComplexId.useQuery({
    complexId: user?.data?.user?.sportsComplexId ?? ""
  })
  return (
    <div className={"flex flex-col w-full p-6 gap-4"}>
      <div className={"flex flex-col w-full flex-1 gap-2"}>
        <p className='font-medium text-xl'>On Going Bookings</p>
        {bookingLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        ) : (
          <DataTable
            columns={[...bookingColumns, {
              id: "closeBooking",
              accessorKey: "court.name",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Close Booking
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => (
                <CloseBooking bookingId={row?.original?.courtBookings?.id} />
              )
            }]}
            data={bookings?.filter(b => b.courtBookings?.status === "ongoing") ?? []}
            paginationRequired
            rightPin={["options"]}
          />
        )}
      </div>
      <div className={"flex flex-col w-full flex-1 gap-2"}>
        <p className='font-medium text-xl'>All Bookings</p>
        {bookingLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        ) : (
          <DataTable
            columns={[...bookingColumns, {
              accessorKey: "court.name",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => (
                <p className="text-md pl-3.5">
                  {row?.original?.courtBookings?.amount ?? "--"}
                </p>
              )
            },
            {
              accessorKey: "court.name",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Inventory Given
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => (
                <p className='pl-3'>{row?.original?.courtBookings?.inventoryGiven ? "Yes" : "No"}</p>
              )
            },
            {
              accessorKey: "court.name",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Inventory Recived
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => (
                <p className='pl-3'>{row?.original?.courtBookings?.inventoryRecived ? "Yes" : "No"}</p>
              )
            },
            {
              accessorKey: "courtBookings.paymentMode",
              header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Payment Mode
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
              cell: ({ row }) => (
                <p className="pl-2">{row?.original?.courtBookings?.paymentMode ?? "--"}</p>
              )
            }
          ]}
            data={bookings ?? []}
            paginationRequired
            rightPin={["options"]}
          />
        )}
      </div>
    </div>
  )
}
