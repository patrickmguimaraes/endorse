import { RequestCopyright } from "./request-copyright.model";
import { User } from "./user.model";

export class RequestCopyrightAssignment {
    id: number;
    name: string;
    email: string;
    permission: 'Edit' | 'View' | 'Reply';
    canBeRemoved: boolean;
    
    userId: number;
    requestId: number;

    user: User;
    request: RequestCopyright;
}