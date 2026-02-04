// Debug utility to log Firestore operations
export const DEBUG_MODE = false; // Set to true for debugging

export function logFirestoreOperation(operation: string, data?: any) {
    if (DEBUG_MODE) {
        console.group(`🔥 Firestore: ${operation}`);
        if (data) {
            console.log('Data:', data);
        }
        console.log('Timestamp:', new Date().toISOString());
        console.groupEnd();
    }
}
