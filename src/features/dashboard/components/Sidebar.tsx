import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Kanban,
    Users,
    Settings,
    LogOut,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { InstallPrompt } from "@/features/settings/components/InstallPrompt";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Kanban, label: "Board", href: "/board" },
    { icon: Users, label: "Leads", href: "/leads" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ className }: { className?: string }) {
    const location = useLocation();

    const { user } = useAuthStore();

    // Helper for real logout since simple hook doesn't export signOut directly usually, 
    // but we can import auth from firebase or add signOut to store.
    // We'll use the one from firebase logic directly here for simplicity or add to store.
    // The store listener tracks state, but action is usually external.
    // Let's import auth for now.
    const handleLogout = async () => {
        const { auth } = await import("@/lib/firebase");
        auth.signOut();
    };

    return (
        <div className={cn("h-full flex flex-col glass-panel border-r border-white/10", className)}>
            {/* Logo Area */}
            <div className="p-6 border-b border-white/10 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(108,93,211,0.5)]">
                    <Zap className="h-5 w-5 text-white fill-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                    LeadFlow <span className="text-primary">Pro</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(108,93,211,0.2)]"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "group-hover:text-white")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-white/10 space-y-4">
                <InstallPrompt />
                <div className="flex items-center gap-3 px-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                        {user?.displayName?.[0] || "U"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
