import { Task } from "./task";

export interface User {
    id: string,
    name: string,
    tasks: Task[]
}