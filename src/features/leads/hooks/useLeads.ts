import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "../services/leadService";
import { logService } from "@/features/activity/services/logService";
import type { Lead, LeadInput } from "../schemas";

export const KEYS = {
    LEADS: ["leads"],
};

export function useLeadsQuery(userId: string | undefined) {
    return useQuery({
        queryKey: [...KEYS.LEADS, userId],
        queryFn: () => leadService.fetchLeads(userId!),
        enabled: !!userId,
    });
}

export function useCreateLeadMutation(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newLead: LeadInput) => leadService.addLead(newLead, userId),

        onMutate: async (newLead) => {
            const queryKey = [...KEYS.LEADS, userId];
            await queryClient.cancelQueries({ queryKey });

            const previousLeads = queryClient.getQueryData<Lead[]>(queryKey);

            const optimisticLead: Lead = {
                id: `temp-${Date.now()}`,
                userId: userId,
                ...newLead,
                createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
                updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
                tags: newLead.tags || [],
                notes: ""
            };

            queryClient.setQueryData<Lead[]>(queryKey, (old) => {
                return [...(old || []), optimisticLead].sort((a, b) => {
                    const aTime = typeof a.createdAt === 'object' && 'seconds' in a.createdAt
                        ? a.createdAt.seconds
                        : Date.now() / 1000;
                    const bTime = typeof b.createdAt === 'object' && 'seconds' in b.createdAt
                        ? b.createdAt.seconds
                        : Date.now() / 1000;
                    return bTime - aTime;
                });
            });

            return { previousLeads };
        },

        onError: (_err, _newLead, context) => {
            if (context?.previousLeads) {
                queryClient.setQueryData([...KEYS.LEADS, userId], context.previousLeads);
            }
            console.error("Failed to create lead via mutation");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...KEYS.LEADS, userId] });
        },

        onSuccess: (leadId, variables) => {
            // No need to invalidate here as onSettled does it, but we log here.
            logService.logAction(leadId || 'unknown', 'CREATED', `Created new lead: ${variables.companyName}`);
        },
    });
}

export function useUpdateLeadMutation(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ leadId, status }: { leadId: string; status: string }) =>
            leadService.updateLeadStatus(leadId, status),

        // Optimistic Update
        onMutate: async ({ leadId, status }) => {
            const queryKey = [...KEYS.LEADS, userId];

            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey });

            // Snapshot previous value
            const previousLeads = queryClient.getQueryData<Lead[]>(queryKey);

            // Optimistically update
            if (previousLeads) {
                queryClient.setQueryData<Lead[]>(queryKey, (old) =>
                    old?.map(lead =>
                        lead.id === leadId ? { ...lead, status: status as Lead['status'] } : lead
                    )
                );
            }

            return { previousLeads };
        },

        onError: (_err, _newLead, context) => {
            if (context?.previousLeads) {
                queryClient.setQueryData([...KEYS.LEADS, userId], context.previousLeads);
            }
        },

        onSuccess: (_data, variables) => {
            logService.logAction(variables.leadId, 'MOVED', `Moved to ${variables.status.toUpperCase()}`);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [...KEYS.LEADS, userId] });
        },
    });
}

export function useDeleteLeadMutation(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (leadId: string) => leadService.deleteLead(leadId),
        onSuccess: (_data, leadId) => {
            queryClient.invalidateQueries({ queryKey: [...KEYS.LEADS, userId] });
            logService.logAction(leadId, 'DELETED', "Deleted lead");
        },
    });
}

export function useEditLeadMutation(userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ leadId, data }: { leadId: string; data: Partial<LeadInput> }) =>
            leadService.updateLead(leadId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [...KEYS.LEADS, userId] });
            logService.logAction(variables.leadId, 'UPDATED', `Updated details for ${variables.data.companyName || "lead"}`);
        },
    });
}
