import { Post } from "./post";
import { User } from "./user.model";

export class Endorsement {
    id: number;
    text: string;

    userId: number;
    user: User;

    post: Post;
    postId: number;

    endorsement?: Endorsement;
    endorsementId?: number;

    endorsements: Array<Endorsement>;

    status: 'Active' | 'Hidden';
}