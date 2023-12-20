import { Request } from "./request.model";
import { User } from "./user.model";

export class RequestAssignment {
    id: number;
    name: string;
    email: string;
    permission: 'Edit' | 'View' | 'Reply';
    canBeRemoved: boolean;
    
    userId: number;
    requestId: number;

    user: User;
    request: Request;
}