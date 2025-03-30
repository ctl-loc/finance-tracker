export interface Transaction {
    _id: number;
    value: number;
    description: string;
    tags: string[];
    time: string;
}
