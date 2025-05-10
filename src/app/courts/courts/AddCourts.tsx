
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormInput from "~/components/custom/FormInput";
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
const AddCourtSchema = z.object({
    name: z.string(),
    courtNumber: z.string(),
    sport: z.string(),
    complexId: z.string().optional(),
    price: z.coerce.number()
})
type AddCourtType = z.infer<typeof AddCourtSchema>
export function AddCourt({ complexId }:{complexId: string}) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <p className="border rounded-2xl w-[300px] h-[100px] flex justify-center items-center flex-col">
                    <Plus />
                    <span className="text-zinc-400">Add Court</span>
                </p>
            </DialogTrigger>
            <DialogContent className="max-h-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Court</DialogTitle>
                </DialogHeader>
                <AddCourtForm complexId={complexId} onCreate={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

const AddCourtForm = ({ complexId, onCreate }:{complexId: string, onCreate: () => void}) => {
    const utils = api.useUtils();
    const form = useForm<AddCourtType>({
        resolver: zodResolver(AddCourtSchema),
        defaultValues: {
            complexId:complexId
        }
    })
    const addSportsComplexMutation = api.court.addCourt.useMutation({
        onSuccess: async() => {
            toast("Court Added successfully");
            onCreate();
            // redirect("/dashboard")
            await utils.court.getCourtsByComplexId.invalidate()
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    });
    const formSubmission = async (values: AddCourtType) => {
        await addSportsComplexMutation.mutateAsync({ ...values })
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
                        <FormInput
                            control={form.control}
                            name={"courtNumber"}
                            label='Court Number'
                            placeholder='Enter Court Number'
                        />
                        <FormInput
                            control={form.control}
                            name={"sport"}
                            label='Sport'
                            placeholder='Enter Sport'
                        />
                        <FormInput
                            control={form.control}
                            name={"price"}
                            label='Price'
                            placeholder='Enter Price'
                            type="number"
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