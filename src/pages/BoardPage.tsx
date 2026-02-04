import { KanbanBoard } from "@/features/board/components/KanbanBoard";
import { AddLeadDialog } from "@/features/leads/components/AddLeadDialog";

export default function BoardPage() {
    return (
        <div className="h-[calc(100vh-120px)] w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Deal Board</h1>
                    <p className="text-gray-400">Manage leads and opportunities</p>
                </div>
                <AddLeadDialog />
            </div>
            <KanbanBoard />
        </div>
    );
}
