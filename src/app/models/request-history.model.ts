import { Request } from "./request.model";
import { User } from "./user.model";

export class RequestHistory {
    id: number;
    date: Date;
    action: 'Created' | 'Endosed' | 'Replyed' | 'Declined' | 'Approved' | 'Deleted' | 'Assigned' | 'Edited' | 'New File';

    requestId: number;
    request: Request;

    userId: number;
    user: User;
}