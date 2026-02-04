import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { settingsService } from "../services/settingsService";
import { passwordSchema, type PasswordValues } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SecurityForm() {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const form = useForm<PasswordValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        }
    });

    async function onSubmit(data: PasswordValues) {
        if (!user) return;
        setLoading(true);
        try {
            await settingsService.changeUserPassword(user, data.newPassword);
            toast.success("Password changed successfully. Please log in again.");
            form.reset();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to update password. You may need to re-login first.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <Alert variant="destructive" className="border-red-500/20 bg-red-500/10 text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                    Updating your password will require you to log in again on all devices.
                </AlertDescription>
            </Alert>

            <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    {...form.register("newPassword")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                {form.formState.errors.newPassword && (
                    <p className="text-xs text-red-400">{form.formState.errors.newPassword.message}</p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
                {form.formState.errors.confirmPassword && (
                    <p className="text-xs text-red-400">{form.formState.errors.confirmPassword.message}</p>
                )}
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} variant="destructive">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                </Button>
            </div>
        </form>
    );
}
