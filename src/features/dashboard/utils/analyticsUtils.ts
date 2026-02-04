import type { Lead } from "@/features/leads/schemas";

export function calculateTotalRevenue(leads: Lead[]): number {
    return leads.reduce((sum, lead) => sum + lead.value, 0);
}

export function calculateConversionRate(leads: Lead[]): number {
    if (!leads.length) return 0;
    const closedLeads = leads.filter(l => l.status === "closed");
    return Math.round((closedLeads.length / leads.length) * 100);
}

export function calculateActiveDeals(leads: Lead[]): number {
    return leads.filter(l => l.status !== "closed" && l.status !== "new").length;
    // Or just all not closed? 'new', 'contacted', 'proposal' are all essentially active pipeline.
    // Let's count all non-closed as Active for now.
}

export function getLeadsByStatus(leads: Lead[]) {
    const statusCounts = {
        new: 0,
        contacted: 0,
        proposal: 0,
        closed: 0,
    };

    leads.forEach(lead => {
        if (statusCounts[lead.status as keyof typeof statusCounts] !== undefined) {
            statusCounts[lead.status as keyof typeof statusCounts]++;
        }
    });

    return [
        { name: "New", count: statusCounts.new, fill: "#3F8CFF" }, // Blue
        { name: "Contacted", count: statusCounts.contacted, fill: "#FFB800" }, // Yellow
        { name: "Proposal", count: statusCounts.proposal, fill: "#6C5DD3" }, // Purple
        { name: "Closed", count: statusCounts.closed, fill: "#4ade80" }, // Green
    ];
}
