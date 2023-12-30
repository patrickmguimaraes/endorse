import { RequestCopyright } from "./request-copyright.model";
import { User } from "./user.model";

export class RequestCopyrightHistory {
    id: number;
    date: Date;
    action: 'Created' | 'Endosed' | 'Replyed' | 'Declined' | 'Approved' | 'Deleted' | 'Assigned' | 'Edited' | 'New File';

    requestId: number;
    request: RequestCopyright;

    userId: number;
    user: User;
}