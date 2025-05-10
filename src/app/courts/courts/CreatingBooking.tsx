
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DatetimePicker } from "~/components/custom/DateTimePicker";
import FormCheckBox from "~/components/custom/FormCheckBox";
import FormInput from "~/components/custom/FormInput";
import PhoneInputField from "~/components/custom/PhoneInput";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
const CreatingCourtBookingSchema = z.object({
    name: z.string(),
    mobile: z.string(),
    email: z.string(),
    inventoryGiven: z.boolean().optional(),
    inTime: z.coerce.date(),
})
type AddCourtType = z.infer<typeof CreatingCourtBookingSchema>
export function CreateBooking({ courtId }: { courtId: string }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}><Plus /> Create Booking</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Booking</DialogTitle>
                </DialogHeader>
                <CreateCourtBookingForm courtId={courtId} onCreate={() => setOpen(false)}/>
            </DialogContent>
        </Dialog>
    );
}

const CreateCourtBookingForm = ({ courtId, onCreate }: { courtId: string, onCreate: () => void }) => {
    const utils = api.useUtils();
    const form = useForm<AddCourtType>({
        resolver: zodResolver(CreatingCourtBookingSchema),
        defaultValues: {
            mobile:"+91",
            inventoryGiven: false,
            inTime: new Date()
        }
    })
    const createBookingMutation = api.bookings.createBooking.useMutation({
        onSuccess: async () => {
            toast("Created Booking successfully");
            onCreate();
            // redirect("/dashboard")
            await utils.court.getCourtsByComplexId.invalidate()
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    });
    const formSubmission = async (values: AddCourtType) => {
        await createBookingMutation.mutateAsync({ ...values, courtId })
    }
    return (
        <div>
            <FormProvider {...form}>
                <Form {...form}>
                    <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(formSubmission)}>
                        <FormInput
                            control={form.control}
                            name={"name"}
                            label='Name'
                            placeholder='Enter Court name'
                        />
                        <PhoneInputField
                            control={form.control}
                            name={"mobile"}
                            label='Mobile Number'
                            placeholder='Enter Mobile Number'
                        />
                        <FormInput
                            control={form.control}
                            name={"email"}
                            label='Email'
                            type="email"
                            placeholder='Enter Email'
                        />
                        <DatetimePicker<AddCourtType> name="inTime" label="In Time"/>
                        <FormCheckBox
                            control={form.control}
                            name={"inventoryGiven"}
                            label='Inventory Given'
                        />
                        <div className="mt-4 flex w-full justify-center gap-3">
                            <DialogClose asChild>
                                <Button variant="outline" className="w-32 p-5">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" className="w-32 p-5">Submit</Button>
                        </div>
                    </form>
                </Form>
            </FormProvider>
        </div>
    )
}