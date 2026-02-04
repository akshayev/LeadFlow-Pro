import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { AuditLog, AuditAction } from "../types";

const COLLECTION_NAME = "activity_logs";

export const logService = {
    async logAction(leadId: string, action: AuditAction, details: string) {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const log: AuditLog = {
                leadId,
                userId: user.uid,
                userName: user.displayName || "Unknown User",
                action,
                details,
                timestamp: serverTimestamp() as Timestamp
            };

            await addDoc(collection(db, COLLECTION_NAME), log);
        } catch (error) {
            console.error("Failed to log action:", error);
            // We don't throw here to prevent blocking the main action
        }
    },

    async getRecentLogs(count: number = 20): Promise<AuditLog[]> {
        const user = auth.currentUser;
        if (!user) return [];

        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", user.uid),
                orderBy("timestamp", "desc"),
                limit(count)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as AuditLog));
        } catch (error) {
            console.error("Failed to fetch logs:", error);
            return [];
        }
    }
};
