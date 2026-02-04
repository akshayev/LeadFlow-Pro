import { Timestamp } from "firebase/firestore";

export type AuditAction = 'CREATED' | 'MOVED' | 'UPDATED' | 'CLOSED' | 'DELETED';

export interface AuditLog {
    id?: string;
    leadId: string;
    userId: string;
    userName: string;
    action: AuditAction;
    details: string;
    timestamp: Timestamp;
}
