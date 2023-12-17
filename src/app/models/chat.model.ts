import { User } from "./user.model";

export class Chat {
    id: number;
    user1Id: number;
    user2Id: number;

    user1: User;
    user2: User;
}