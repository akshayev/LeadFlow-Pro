import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy
} from "firebase/firestore";
import type { Lead, LeadInput } from "../schemas";

const COLLECTION_NAME = "leads";

export const leadService = {
    async addLead(lead: LeadInput, userId: string): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...lead,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error('❌ Firestore Write FAILED:', error);
            throw error;
        }
    },

    async fetchLeads(userId: string): Promise<Lead[]> {
        try {
            const q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(q);
            const leads = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Lead[];
            return leads;
        } catch (error) {
            console.error('❌ Firestore Read FAILED:', error);
            throw error;
        }
    },

    async updateLeadStatus(leadId: string, newStatus: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, leadId);
        await updateDoc(docRef, {
            status: newStatus,
            updatedAt: serverTimestamp(),
        });
    },

    async updateLead(leadId: string, data: Partial<LeadInput>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, leadId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async deleteLead(leadId: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, leadId);
        await deleteDoc(docRef);
    }
};
