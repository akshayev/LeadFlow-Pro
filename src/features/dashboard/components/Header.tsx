import { Menu, Bell, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Header() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <header className="sticky top-0 z-30 h-16 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
                {/* Mobile Sidebar Trigger */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-white">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-transparent border-r-0 w-80">
                        <Sidebar className="border-r border-white/10 h-full" />
                    </SheetContent>
                </Sheet>

                {/* Page Title (Optional placeholder) */}
                <h1 className="text-lg font-semibold text-white md:hidden">LeadFlow Pro</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-[#1F2128] border-white/10">
                        <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <div className="p-4 text-center text-sm text-gray-400">
                            No new notifications
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-8 w-[1px] bg-white/10 mx-1" />

                {/* Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 cursor-pointer">
                            <span className="hidden sm:block text-sm font-medium text-white">
                                {user?.displayName || "User"}
                            </span>
                            <Avatar className="h-9 w-9 border border-white/10 cursor-pointer transition-transform hover:scale-105">
                                <AvatarImage src={user?.photoURL || ""} />
                                <AvatarFallback className="bg-primary text-white font-bold">
                                    {user?.displayName?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#1F2128] border-white/10">
                        <DropdownMenuLabel className="text-white">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user?.displayName || "User"}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                            onClick={() => navigate("/settings")}
                            className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
