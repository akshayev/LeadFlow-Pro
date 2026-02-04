import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Column, Task } from "@/features/board/types";
import { BoardCard } from "./BoardCard";
import { cn } from "@/lib/utils";

interface Props {
    column: Column;
    tasks: Task[];
}

export function BoardColumn({ column, tasks }: Props) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const taskIds = tasks.map((t) => t.id);

    return (
        <div className="flex flex-col w-[300px] shrink-0 gap-2">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 bg-card/20 p-3 rounded-lg border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white tracking-tight">{column.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-gray-400">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Task List (Droppable Area) */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 flex flex-col gap-3 p-1 min-h-[500px]",
                )}
            >
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <BoardCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
