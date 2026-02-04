// Settings service placeholder
import { updateProfile, updatePassword } from "firebase/auth";
import type { User } from "firebase/auth";

export const settingsService = {
    async updateUserProfile(user: User, displayName: string): Promise<void> {
        if (!user) throw new Error("No user logged in");
        await updateProfile(user, { displayName });
    },

    async changeUserPassword(user: User, newPassword: string): Promise<void> {
        if (!user) throw new Error("No user logged in");
        await updatePassword(user, newPassword);
    }
};
