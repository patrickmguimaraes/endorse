import { Endorse } from "./endorse.model";
import { User } from "./user.model";

export class EndorseAssignment {
    id: number;
    name: string;
    email: string;
    permission: 'Edit' | 'View' | 'Reply';
    canBeRemoved: boolean;
    
    userId: number;
    endorseId: number;

    user: User;
    endorse: Endorse;
}