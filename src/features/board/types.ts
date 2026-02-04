export type Id = string | number;

export interface Column {
    id: Id;
    title: string;
}

export interface Task {
    id: Id;
    columnId: Id;
    content: string;
    value: number;
    companyName: string;
    tags: string[];
}
