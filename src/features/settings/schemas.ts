import { z } from "zod";

export const profileSchema = z.object({
    displayName: z.string().min(2, "Display name must be at least 2 characters"),
    email: z.string().email("Invalid email address").readonly(), // Read-only in UI, mostly for display/validation if needed
});

export const passwordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ProfileValues = z.infer<typeof profileSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;
