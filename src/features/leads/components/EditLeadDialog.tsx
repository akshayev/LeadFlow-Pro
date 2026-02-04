import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { leadSchema, type LeadInput, type Lead } from "../schemas";
import { useEditLeadMutation } from "../hooks/useLeads";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface EditLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
}

export function EditLeadDialog({ open, onOpenChange, lead }: EditLeadDialogProps) {
    const { user } = useAuthStore();
    const { mutate: editLead, isPending } = useEditLeadMutation(user?.uid || "");

    const form = useForm<LeadInput>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            contactName: lead.contactName,
            email: lead.email,
            companyName: lead.companyName,
            value: lead.value,
            status: lead.status,
            tags: lead.tags || [],
        },
    });

    // Reset form when lead changes
    useEffect(() => {
        if (lead) {
            form.reset({
                contactName: lead.contactName,
                email: lead.email,
                companyName: lead.companyName,
                value: lead.value,
                status: lead.status,
                tags: lead.tags || [],
            });
        }
    }, [lead, form]);

    function onSubmit(data: LeadInput) {
        editLead(
            { leadId: lead.id, data },
            {
                onSuccess: () => {
                    toast.success("Lead updated successfully");
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Failed to update lead");
                },
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] glass-panel border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Make changes to the lead details here.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" className="bg-white/5 border-white/10 text-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Inc." className="bg-white/5 border-white/10 text-white" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Deal Value ($)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="1000"
                                            className="bg-white/5 border-white/10 text-white"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
