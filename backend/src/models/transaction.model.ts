export interface Transaction {
    _id?: number;
    value: number;
    description: string;
    tags: string[];
    time?: string;
    user_id: number;
}
