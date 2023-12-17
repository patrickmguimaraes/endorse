import { Endorse } from "./endorse.model";
import { User } from "./user.model";

export class File {
    id: number;
    name: string;
    path: string;

    userId?: number;
    endorseId?: number;

    user?: User;
    endorse?: Endorse;
}