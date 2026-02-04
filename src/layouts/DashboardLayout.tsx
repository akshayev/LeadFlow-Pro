import { Outlet } from "react-router-dom";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";

export function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-40">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <Header />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                    {/* Background Gradients for the main area */}
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
