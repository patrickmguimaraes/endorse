import { Post } from "./post";
import { User } from "./user.model";

export class Endorse {
    id: number;
    text?: string;
    date?: Date;
    status?: 'Posted' | 'Hidden';

    postId?: number;
    post: Post;

    userId: number;
    user?: User;

    father?: Endorse;
    fatherId?: number;
    children?: Array<Endorse>;
}