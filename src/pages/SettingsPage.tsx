import { useAuthStore } from "@/store/useAuthStore";
import { ProfileForm } from "@/features/settings/components/ProfileForm";
import { SecurityForm } from "@/features/settings/components/SecurityForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, User, Settings as SettingsIcon, Database, Lock, Download, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExportData = async () => {
        if (!user?.uid) {
            toast.error("You must be logged in to export data");
            return;
        }

        setIsExporting(true);
        toast.info("Exporting your data...");

        try {
            // Import Firestore functions
            const { collection, query, where, getDocs } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            // Fetch all user data
            const [leadsSnapshot, logsSnapshot] = await Promise.all([
                getDocs(query(collection(db, "leads"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "activity_logs"), where("userId", "==", user.uid)))
            ]);

            // Format data
            const leads = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const activityLogs = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const exportData = {
                exportDate: new Date().toISOString(),
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName
                },
                statistics: {
                    totalLeads: leads.length,
                    totalLogs: activityLogs.length
                },
                leads,
                activityLogs
            };

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leadflow-pro-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success(`Data exported successfully! (${leads.length} leads, ${activityLogs.length} logs)`);
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            if (user) {
                await deleteUser(user);
                toast.success("Account deleted successfully");
                navigate("/login");
            }
        } catch (error: any) {
            console.error("Account deletion failed:", error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error("Please log out and log back in before deleting your account");
            } else {
                toast.error("Failed to delete account. Please try again.");
            }
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Account Settings</h1>
                <p className="text-gray-400">Manage your profile, security, and preferences.</p>
            </div>

            {/* Profile Header */}
            <div className="glass-panel p-6 flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src={user?.photoURL || ""} />
                    <AvatarFallback className="text-lg bg-primary/20 text-primary">
                        {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold text-white">{user?.displayName || "User"}</h2>
                    <p className="text-gray-400">{user?.email}</p>
                    <div className="mt-2 text-xs uppercase tracking-wider font-semibold text-primary bg-primary/10 inline-block px-2 py-0.5 rounded">
                        Admin
                    </div>
                </div>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 w-full justify-start h-auto p-1 flex-wrap">
                    <TabsTrigger
                        value="general"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 gap-2 px-6 py-2"
                    >
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 gap-2 px-6 py-2"
                    >
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="preferences"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 gap-2 px-6 py-2"
                    >
                        <SettingsIcon className="h-4 w-4" />
                        Preferences
                    </TabsTrigger>
                    <TabsTrigger
                        value="data"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 gap-2 px-6 py-2"
                    >
                        <Database className="h-4 w-4" />
                        Data
                    </TabsTrigger>
                    <TabsTrigger
                        value="privacy"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white text-gray-400 gap-2 px-6 py-2"
                    >
                        <Lock className="h-4 w-4" />
                        Privacy
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <div className="mt-6 glass-panel p-6">
                    <TabsContent value="general" className="mt-0">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white">Profile Information</h3>
                            <p className="text-sm text-gray-400">Update your account details and public profile.</p>
                        </div>
                        <ProfileForm />
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="mt-0">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white">Security</h3>
                            <p className="text-sm text-gray-400">Manage your password and account security.</p>
                        </div>
                        <SecurityForm />
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="mt-0 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-white">Notifications</h3>
                            <p className="text-sm text-gray-400">Control how you receive notifications.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <div>
                                        <Label className="text-white font-medium">Email Notifications</Label>
                                        <p className="text-sm text-gray-400">Receive updates via email</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-5 w-5 text-primary" />
                                    <div>
                                        <Label className="text-white font-medium">Push Notifications</Label>
                                        <p className="text-sm text-gray-400">Receive push notifications</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={pushNotifications}
                                    onCheckedChange={setPushNotifications}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Data Management Tab */}
                    <TabsContent value="data" className="mt-0 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-white">Data Management</h3>
                            <p className="text-sm text-gray-400">Export or manage your CRM data.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-start gap-3 mb-3">
                                    <Download className="h-5 w-5 text-primary mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">Export Your Data</h4>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Download all your leads, contacts, and activity logs in JSON format.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleExportData}
                                    disabled={isExporting}
                                    className="w-full bg-primary hover:bg-primary/90"
                                >
                                    <Download className={`mr-2 h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`} />
                                    {isExporting ? 'Exporting...' : 'Export Data'}
                                </Button>
                            </div>

                            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <div className="flex items-start gap-3">
                                    <Database className="h-5 w-5 text-amber-400 mt-0.5" />
                                    <div>
                                        <h4 className="text-amber-400 font-medium">Data Storage</h4>
                                        <p className="text-sm text-gray-400 mt-1">
                                            Your data is securely stored in Google Firestore with automatic backups.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Privacy & Account Deletion Tab */}
                    <TabsContent value="privacy" className="mt-0 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-white">Privacy & Account</h3>
                            <p className="text-sm text-gray-400">Manage your privacy settings and account.</p>
                        </div>

                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-start gap-3 mb-4">
                                <Trash2 className="h-5 w-5 text-red-400 mt-0.5" />
                                <div>
                                    <h4 className="text-red-400 font-medium">Delete Account</h4>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete My Account
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-[#1F2128] border-white/10">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-400">
                                            This action cannot be undone. This will permanently delete your account
                                            and remove all your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Yes, delete my account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
