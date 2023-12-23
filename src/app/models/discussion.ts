import { Post } from "./post";
import { User } from "./user.model";

export class Discussion {
    id: number;
    text: string;
    type: string;

    userId: number;
    user: User;

    post: Post;
    postId: number;

    comment?: Comment;
    commentId?: number;
    comments: Array<Comment>;

    status: 'Active' | 'Hidden';
}