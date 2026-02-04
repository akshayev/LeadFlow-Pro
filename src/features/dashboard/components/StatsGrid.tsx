import { DollarSign, Activity, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsGridProps {
    revenue: number;
    activeDeals: number;
    conversionRate: number;
}

export function StatsGrid({ revenue, activeDeals, conversionRate }: StatsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass-panel border-white/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">${revenue.toLocaleString()}</div>
                    <p className="text-xs text-green-400/80">
                        +20.1% from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                        Active Deals
                    </CardTitle>
                    <Activity className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{activeDeals}</div>
                    <p className="text-xs text-gray-500">
                        Currently in pipeline
                    </p>
                </CardContent>
            </Card>

            <Card className="glass-panel border-white/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                        Win Rate
                    </CardTitle>
                    <Percent className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{conversionRate}%</div>
                    <p className="text-xs text-gray-500">
                        Conversion ratio
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
