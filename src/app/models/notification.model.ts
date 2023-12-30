import { User } from "./user.model";

export class Notification {
    id: number;
    title: string;
    text?: string;
    image: string;
    link: string;
    date: Date;
    
    user?: User;
    userId: number;

    read: boolean = false;
}