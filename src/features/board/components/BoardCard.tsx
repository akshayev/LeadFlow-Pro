import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/features/board/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDeleteLeadMutation } from "@/features/leads/hooks/useLeads";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditLeadDialog } from "@/features/leads/components/EditLeadDialog";

interface Props {
    task: Task;
}

export function BoardCard({ task }: Props) {
    const { user } = useAuthStore();
    const { mutate: deleteLead } = useDeleteLeadMutation(user?.uid || "");
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this lead?")) {
            deleteLead(task.id as string, {
                onSuccess: () => toast.success("Lead deleted"),
                onError: () => toast.error("Failed to delete lead")
            });
        }
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-primary/20 border-2 border-primary rounded-xl h-[120px]"
            />
        );
    }

    // Convert Task back to simplified Lead for Edit Dialog
    const leadForEdit = {
        id: task.id as string,
        contactName: task.content,
        companyName: task.companyName,
        value: task.value,
        status: task.columnId,
        tags: task.tags,
        email: (task as any).email || "",
        userId: user?.uid || "",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-card border border-border rounded-xl p-3 hover:ring-2 hover:ring-primary/50 cursor-grab relative group"
            >
                <Card className="glass-panel border-white/5 hover:border-primary/50 transition-colors w-full border-none shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between p-0 pb-2 space-y-0">
                        <CardTitle className="text-sm font-semibold truncate max-w-[80%] text-white">{task.content}</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                    onClick={(e) => e.stopPropagation()} // Stop drag
                                    onPointerDown={(e) => e.stopPropagation()} // Stop drag start
                                >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#1A1B23] border-white/10 text-white z-50">
                                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="p-0 text-sm text-muted-foreground space-y-2">
                        <p className="text-xs text-gray-400 line-clamp-1">{task.companyName}</p>
                        <div className="flex flex-wrap gap-1 items-center justify-between">
                            <span className="font-bold text-green-400">
                                ${task.value.toLocaleString()}
                            </span>
                            <div className="flex gap-1">
                                {task.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-1.5 py-0 text-[10px] bg-white/10 text-gray-300 border-none">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <EditLeadDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                lead={leadForEdit as any}
            />
        </>
    );
}
