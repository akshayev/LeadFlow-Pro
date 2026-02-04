import { useAuthStore } from "@/store/useAuthStore";
import { useLeadsQuery } from "@/features/leads/hooks/useLeads";
import { calculateTotalRevenue, calculateConversionRate, calculateActiveDeals, getLeadsByStatus } from "@/features/dashboard/utils/analyticsUtils";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { StatusChart } from "@/features/dashboard/components/StatusChart";
import { Loader2 } from "lucide-react";
import { RecentLeads } from "@/features/dashboard/components/RecentLeads";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const { data: leads, isLoading } = useLeadsQuery(user?.uid);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const revenue = leads ? calculateTotalRevenue(leads) : 0;
    const conversionRate = leads ? calculateConversionRate(leads) : 0;
    const activeDeals = leads ? calculateActiveDeals(leads) : 0;
    const chartData = leads ? getLeadsByStatus(leads) : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Overview of your sales performance.</p>
            </div>

            <StatsGrid
                revenue={revenue}
                activeDeals={activeDeals}
                conversionRate={conversionRate}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 space-y-6">
                    <StatusChart data={chartData} />
                    <RecentActivity />
                </div>
                <div className="col-span-3">
                    <RecentLeads leads={leads || []} />
                </div>
            </div>
        </div>
    );
}
