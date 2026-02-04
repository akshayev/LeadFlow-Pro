import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
    user: User | null;
    loading: boolean;
    role: string | null;
    initializeListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    role: 'user', // Default role
    initializeListener: () => {
        set({ loading: true });
        return onAuthStateChanged(auth, (user) => {
            if (user) {
                // In a real app, you might fetch claims or a user doc here for 'role'
                set({ user, loading: false });
            } else {
                set({ user: null, loading: false });
            }
        });
    },
}));
