import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";

export function ProtectedLayout() {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardLayout />
    );
}
