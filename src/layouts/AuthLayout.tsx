import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";

export function AuthLayout() {
    const { user, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#111315]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-md p-4">
                <Outlet />
            </div>
        </div>
    );
}
