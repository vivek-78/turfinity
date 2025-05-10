"use client"
import { useSession } from 'next-auth/react'
import React from 'react'
import { redirect, useRouter } from 'next/navigation'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '~/components/ui/form'
import FormInput from '~/components/custom/FormInput'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

const SportsComplexDetailsSchema = z.object({
    name: z.string(),
    address: z.string(),
    mobileNumber: z.string()
})
type SportsComplexDetailsType = z.infer<typeof SportsComplexDetailsSchema>
export default function Page() {
    const user = useSession();
    const router = useRouter();
    const { data: sessionData, update} = useSession();
    const form = useForm<SportsComplexDetailsType>({
        resolver: zodResolver(SportsComplexDetailsSchema)
    })
    if (user.data?.user?.sportsComplexId) {
        router.push('/')
    }
    const addSportsComplexMutation = api.court.addSportsComplex.useMutation({
        onSuccess: async(data) => {
            toast("Details added successfully");
            await update({
                user: {
                    ...sessionData?.user,
                    sportsportsComplexId: data.id
                }
            })
            redirect("/dashboard")
        },
        onError: () => {
            toast.error("Something went wront")
        }
    });
    const formSubmission = async(values: SportsComplexDetailsType) => {
        await addSportsComplexMutation.mutateAsync({ ...values})
    }
    return (
        <div className='flex flex-col justify-center items-center w-full min-h-screen gap-3'>
            <h1 className='font-semibold text-xl'>Sport Complex Details</h1>
            <div className='flex flex-col gap-3 border min-w-[600px] p-5 rounded-md'>
            <FormProvider {...form}>
                <Form {...form}>
                <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(formSubmission)}>
                    <FormInput
                    control={form.control}
                    name={"name"}
                    label='Name'
                    placeholder='Enter complex name'
                    />
                    <FormInput
                    control={form.control}
                    name={"address"}
                    label='Address'
                    placeholder='Enter Address'
                    />
                    <FormInput
                    control={form.control}
                    name={"mobileNumber"}
                    label='Mobile Number'
                    placeholder='Enter Mobile Number'
                    />
                    <Button>Submit</Button>
                </form>
                </Form>
            </FormProvider>
            </div>
        </div>
    )
}
