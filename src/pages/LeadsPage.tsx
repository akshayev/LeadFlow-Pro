import { AddLeadDialog } from "@/features/leads/components/AddLeadDialog";
import { useLeadsQuery, useDeleteLeadMutation } from "@/features/leads/hooks/useLeads";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2, Trash2 } from "lucide-react";

export default function LeadsPage() {
    const { user } = useAuthStore();
    const { data: leads, isLoading } = useLeadsQuery(user?.uid);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Leads</h1>
                    <p className="text-gray-400">Manage your leads and opportunities.</p>
                </div>
                <AddLeadDialog />
            </div>

            {isLoading ? (
                <div className="flex justify-center p-10">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            ) : (
                <div className="glass-panel overflow-hidden rounded-xl">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/5 text-xs uppercase text-gray-400">
                            <tr>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Value</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {(!leads || leads.length === 0) ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No leads found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-white">{lead.companyName}</td>
                                        <td className="px-6 py-4">{lead.contactName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                                ${lead.status === 'new' ? 'bg-blue-500/10 text-blue-400' : ''}
                                                ${lead.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                                                ${lead.status === 'proposal' ? 'bg-purple-500/10 text-purple-400' : ''}
                                                ${lead.status === 'closed' ? 'bg-green-500/10 text-green-400' : ''}
                                            `}>
                                                {lead.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white">
                                            ${lead.value.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DeleteLeadButton leadId={lead.id} userId={user?.uid || ""} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function DeleteLeadButton({ leadId, userId }: { leadId: string, userId: string }) {
    const { mutate: deleteLead } = useDeleteLeadMutation(userId);

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this lead?")) {
            deleteLead(leadId);
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-400 transition-colors"
            title="Delete Lead"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}
