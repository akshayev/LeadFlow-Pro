import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { logService } from "@/features/activity/services/logService";

export function RecentActivity() {
    const { data: logs } = useQuery({
        queryKey: ["activity_logs"],
        queryFn: () => logService.getRecentLogs(20),
        refetchInterval: 5000 // Poll every 5 seconds for live updates
    });

    return (
        <Card className="glass-panel border-white/5 col-span-3 h-[400px] flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-medium text-white">Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[320px] px-6 pb-6">
                    <div className="space-y-6">
                        {logs?.map((log) => (
                            <div key={log.id} className="flex gap-4 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-[11px] top-8 bottom-[-24px] w-[2px] bg-white/5 last:hidden" />

                                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center ring-4 ring-[#111217] z-10">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                </div>

                                <div className="space-y-1 pb-1">
                                    <p className="text-sm text-white sticky top-0">
                                        <span className="font-semibold text-primary">{log.userName}</span>
                                        {" "}{log.details}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(log.timestamp.toDate(), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {logs?.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No activity recorded yet.</p>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
