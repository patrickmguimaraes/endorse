import { Endorse } from "./endorse.model";
import { User } from "./user.model";

export class EndorseHistory {
    id: number;
    date: Date;
    action: 'Created' | 'Endosed' | 'Replyed' | 'Declined' | 'Approved' | 'Deleted' | 'Assigned' | 'Edited' | 'New File';

    endorseId: number;
    endorse: Endorse;

    userId: number;
    user: User;
}