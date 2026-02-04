import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCreateLeadMutation } from "../hooks/useLeads";
import { leadSchema, type LeadInput } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function AddLeadDialog() {
    const [open, setOpen] = useState(false);
    const { user } = useAuthStore();
    const { mutate, isPending } = useCreateLeadMutation(user?.uid || "");

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<LeadInput>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            companyName: "",
            contactName: "",
            email: "",
            value: 0,
            status: "new",
            tags: [],
        }
    });

    const selectedStatus = watch("status");

    const onSubmit = (data: LeadInput) => {
        if (!user) {
            toast.error("You must be logged in");
            return;
        }

        // Optimistically close and reset
        setOpen(false);
        reset();
        toast.success("Lead created!");

        mutate(data, {
            onError: (error) => {
                console.error("Failed to add lead:", error);
                toast.error("Failed to add lead. Changes reverted.");
                // We could reopen the dialog here effectively, but it's tricky with cleared state.
                // ideally we rely on the error toast.
            }
        });
    };

    const onError = (errors: any) => {
        console.error("Form Validation Errors:", errors);
        toast.error("Please check the form for errors");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(108,93,211,0.5)]">
                    <Plus className="h-4 w-4" /> Add Lead
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel text-white border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Lead</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="grid gap-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            {...register("companyName")}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                            id="contactName"
                            {...register("contactName")}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.contactName && <p className="text-xs text-red-400">{errors.contactName.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="value">Deal Value ($)</Label>
                        <Input
                            id="value"
                            type="number"
                            {...register("value")}
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.value && <p className="text-xs text-red-400">{errors.value.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select onValueChange={(val) => setValue("status", val as any)} defaultValue={selectedStatus}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1F2128] border-white/10 text-white">
                                <SelectItem value="new">New Lead</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="proposal">Proposal Sent</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
                    </div>

                    <Button type="submit" disabled={isPending} className="mt-4 w-full bg-primary hover:bg-primary/90 text-white">
                        {isPending ? "Adding..." : "Create Lead"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
