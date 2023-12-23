import { File } from "./file.model";
import { User } from "./user.model";

export class CollaborationRequest {
    id: number;
    contact: string;
    
    user: User;
    userId: number;

    file: File;
}