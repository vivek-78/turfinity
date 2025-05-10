
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { DatetimePicker } from "~/components/custom/DateTimePicker";
import FormCheckBox from "~/components/custom/FormCheckBox";
import FormInput from "~/components/custom/FormInput";
import PhoneInputField from "~/components/custom/PhoneInput";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import FormSelect from "~/components/custom/FormSelect";

const CloseCourtBookingSchema = z.object({
    bookingId: z.string(),
    outTime: z.coerce.date(),
    amountCollected: z.coerce.number().optional(),
    paymentMode: z.enum(["Cash", "UPI", "Card"]).optional(),
    inventoryRecived: z.boolean().optional(),
})
type CloseBookingType = z.infer<typeof CloseCourtBookingSchema>

export function CloseBooking({ bookingId }: { bookingId: string }) {
    const utils = api.useUtils();
    const closeBookingMutation = api.bookings.closeBooking.useMutation({
        onSuccess: async () => {
            toast("Booking Closed successfully");
            // redirect("/dashboard")
            await utils.bookings.getbookingsByComplexId.invalidate()
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    });
    const form = useForm<CloseBookingType>({
        resolver: zodResolver(CloseCourtBookingSchema),
        defaultValues: {
            bookingId: bookingId,
            outTime: new Date(),
            inventoryRecived: false,
        }
    });
    const formSubmission = async (values: CloseBookingType) => {
        await closeBookingMutation.mutateAsync({ ...values });
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="submit" className="bg-red-600 hover:bg-red-700">Close Booking</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Close Booking</DialogTitle>
                </DialogHeader>
                <div>
                    <FormProvider {...form}>
                        <Form {...form}>
                            <form className='flex flex-col gap-5' onSubmit={form.handleSubmit(formSubmission)}>
                                <DatetimePicker<CloseBookingType> name="outTime" label="Out Time" />
                                <FormInput
                                    control={form.control}
                                    name={"amountCollected"}
                                    label='Received Amount'
                                    placeholder='Enter Amount Collected'
                                    type="number"
                                />
                                <FormSelect
                                    control={form.control}
                                    name={"paymentMode"}
                                    label='Payment Mode'
                                    selectOptions={[{ value: "Cash", name: "Cash" }, { value: "UPI", name: "UPI" }, { value: "Card", name: "Card" }]}
                                    placeholder='Select Payment Mode'
                                    selectClassName="w-full"
                                    required
                                />
                                <FormCheckBox
                                    control={form.control}
                                    name={"inventoryRecived"}
                                    label='Inventory Received'
                                />
                                <div className="mt-4 flex w-full justify-center gap-3">
                                    <DialogClose asChild>
                                        <Button variant="outline" className="w-32 p-5">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" className="w-32 p-5 bg-red-700">Close</Button>
                                </div>
                            </form>
                        </Form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
}