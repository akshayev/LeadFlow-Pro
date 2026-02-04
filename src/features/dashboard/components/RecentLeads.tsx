import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/features/leads/schemas";

interface RecentLeadsProps {
    leads: Lead[];
}

export function RecentLeads({ leads }: RecentLeadsProps) {
    // Sort by createdAt (assuming strictly new to old, though leads might not have createdAt yet strictly typed in frontend schema, 
    // but Firestore returns them. We'll rely on array order or simple slice for now if createdAt isn't guaranteed on all legacy data).
    // Actually, leadSchema has createdAt as default(new Date()).

    // Let's just take the first 5 for now.
    const recent = leads.slice(0, 5);

    return (
        <Card className="glass-panel border-white/5 col-span-3">
            <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {recent.map((lead) => (
                        <div key={lead.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={`https://avatar.vercel.sh/${lead.email}.png`} alt={lead.contactName} />
                                <AvatarFallback className="bg-primary/20 text-primary">
                                    {lead.contactName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{lead.contactName}</p>
                                <p className="text-xs text-gray-400">{lead.companyName}</p>
                            </div>
                            <div className="ml-auto font-medium text-green-400">
                                +${lead.value.toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {recent.length === 0 && (
                        <p className="text-sm text-gray-500">No recent activity.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
