import { z } from "zod";

export const leadSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    contactName: z.string().min(2, "Contact name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    value: z.coerce.number().min(1, "Value must be positive"),
    status: z.enum(["new", "contacted", "proposal", "closed"]),
    tags: z.array(z.string()).optional(),
});

export type Lead = z.infer<typeof leadSchema> & {
    id: string;
    userId: string;
    createdAt: { seconds: number; nanoseconds: number } | Date; // Firestore Timestamp or Date
    updatedAt: { seconds: number; nanoseconds: number } | Date;
    notes?: string;
};
export type LeadInput = z.infer<typeof leadSchema>;
