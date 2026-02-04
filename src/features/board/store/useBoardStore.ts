import { create } from 'zustand';
import type { Id, Column, Task } from '../types';

interface BoardState {
    columns: Column[];
    tasks: Task[];
    activeDragId: Id | null;
    setTasks: (tasks: Task[]) => void;
    setColumns: (columns: Column[]) => void;
    moveTask: (taskId: Id, toColumnId: Id) => void;
    setActiveDragId: (id: Id | null) => void;
}

const mockColumns: Column[] = [
    { id: 'new', title: 'New Leads' },
    { id: 'contacted', title: 'Contacted' },
    { id: 'proposal', title: 'Proposal Sent' },
    { id: 'closed', title: 'Closed' },
];

export const useBoardStore = create<BoardState>((set) => ({
    columns: mockColumns,
    tasks: [], // Start empty, will be populated by Real Data
    activeDragId: null,
    setTasks: (tasks) => set({ tasks }),
    setColumns: (columns) => set({ columns }),
    setActiveDragId: (id) => set({ activeDragId: id }),
    moveTask: (taskId, toColumnId) => set((state) => {
        const newTasks = state.tasks.map(task =>
            task.id === taskId ? { ...task, columnId: toColumnId } : task
        );
        return { tasks: newTasks || [] };
    }),
}));
