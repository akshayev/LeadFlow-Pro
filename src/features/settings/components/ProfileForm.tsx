import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { settingsService } from "../services/settingsService";
import { profileSchema, type ProfileValues } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfileForm() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const form = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            displayName: user?.displayName || "",
            email: user?.email || "",
        }
    });

    async function onSubmit(data: ProfileValues) {
        if (!user) return;
        setLoading(true);
        try {
            await settingsService.updateUserProfile(user, data.displayName);
            toast.success("Profile updated successfully");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-white/5 border-white/10 text-gray-400"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                    id="displayName"
                    {...form.register("displayName")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                {form.formState.errors.displayName && (
                    <p className="text-xs text-red-400">{form.formState.errors.displayName.message}</p>
                )}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
