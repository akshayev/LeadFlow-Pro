import { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor,
    closestCorners,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useBoardStore } from "@/features/board/store/useBoardStore";
import { BoardColumn } from "./BoardColumn";
import { BoardCard } from "./BoardCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useLeadsQuery, useUpdateLeadMutation } from "@/features/leads/hooks/useLeads";

export function KanbanBoard() {
    const { columns, tasks, setTasks, setActiveDragId, activeDragId } = useBoardStore();
    const { user } = useAuthStore();
    const { data: leads, isLoading } = useLeadsQuery(user?.uid);
    const { mutate: updateLead } = useUpdateLeadMutation(user?.uid || "");

    const [expandedColumnId, setExpandedColumnId] = useState<string>("new");
    const [isMobile, setIsMobile] = useState(false);

    // Initial check and listener for screen size
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Sync Real Data to Store
    useEffect(() => {
        if (leads) {
            const mappedTasks = leads.map(lead => ({
                id: lead.id,
                columnId: lead.status,
                content: lead.contactName || "No Contact",
                value: lead.value,
                companyName: lead.companyName,
                tags: lead.tags || [],
                email: lead.email, // Added for Edit Dialog
                userId: lead.userId,
                createdAt: lead.createdAt,
                updatedAt: lead.updatedAt
            }));
            setTasks(mappedTasks);
        }
    }, [leads, setTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor)
    );

    const activeTask = useMemo(
        () => tasks.find((t) => t.id === activeDragId),
        [activeDragId, tasks]
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Task") {
            setActiveDragId(event.active.id as string);
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";
        const isOverColumn = over.data.current?.type === "Column";

        if (!isActiveTask) return;

        // Task over Task
        if (isActiveTask && isOverTask) {
            const activeTaskIndex = tasks.findIndex(t => t.id === activeId);
            const overTaskIndex = tasks.findIndex(t => t.id === overId);

            if (tasks[activeTaskIndex].columnId !== tasks[overTaskIndex].columnId) {
                const newTasks = [...tasks];
                newTasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;
                setTasks(arrayMove(newTasks, activeTaskIndex, overTaskIndex));

                // Trigger DB Update (Cross-Column Move)
                updateLead({
                    leadId: String(activeId),
                    status: String(tasks[overTaskIndex].columnId)
                });
            }
        }

        // Task over Column
        if (isActiveTask && isOverColumn) {
            const activeTaskIndex = tasks.findIndex(t => t.id === activeId);
            if (tasks[activeTaskIndex].columnId !== overId) {
                const newTasks = [...tasks];
                newTasks[activeTaskIndex].columnId = overId as string;
                setTasks(arrayMove(newTasks, activeTaskIndex, activeTaskIndex));

                // Trigger DB Update (Move to Empty Column)
                updateLead({
                    leadId: String(activeId),
                    status: String(overId)
                });
            }
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveDragId(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
        const overTaskIndex = tasks.findIndex((t) => t.id === overId);

        if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
            setTasks(arrayMove(tasks, activeTaskIndex, overTaskIndex));

            // Final check for column consistency
            const activeTask = tasks[activeTaskIndex];
            const overTask = tasks[overTaskIndex];

            if (activeTask.columnId !== overTask.columnId) {
                updateLead({
                    leadId: String(activeId),
                    status: String(overTask.columnId)
                });
            }
        }
    }

    if (isLoading && tasks.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 animate-spin text-primary"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                    <p className="text-gray-400 animate-pulse">Syncing leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className={`flex h-full gap-4 ${isMobile ? "flex-col overflow-y-auto" : "overflow-x-auto pb-4 items-start"}`}>
                    {columns.map((col) => {
                        const isExpanded = isMobile ? expandedColumnId === col.id : true;

                        return (
                            <div
                                key={col.id}
                                className={`${isMobile ? "w-full transition-all duration-300" : "h-full"}`}
                                onClick={() => isMobile && setExpandedColumnId(String(col.id))}
                            >
                                {/* Mobile Header wrapper for touch target if collapsed */}
                                <div className={`${isMobile && !isExpanded ? "opacity-60 hover:opacity-100 cursor-pointer" : ""}`}>
                                    {isExpanded && (
                                        <BoardColumn
                                            column={col}
                                            tasks={tasks.filter((t) => t.columnId === col.id)}
                                        />
                                    )}

                                    {/* Collapsed View (Mobile Only) */}
                                    {isMobile && !isExpanded && (
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center text-white font-bold">
                                            <span>{col.title}</span>
                                            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                                                {tasks.filter(t => t.columnId === col.id).length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeTask && <BoardCard task={activeTask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}
