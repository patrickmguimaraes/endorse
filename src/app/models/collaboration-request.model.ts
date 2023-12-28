import { Collaboration } from "./collaboration.model";
import { File } from "./file.model";
import { User } from "./user.model";

export class CollaborationRequest {
    id: number;
    date: Date = new Date();
    contact: string;
    
    user: User;
    userId: number;

    collaborationId: number;
    collaboration: Collaboration;

    file: File;

    status: "Approved" | "Rejected" | "Reviewing" = "Reviewing";
}