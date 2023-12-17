import { Post } from "./post";
import { User } from "./user.model";

export class Comment {
    id: number;
    text: string;

    userId: number;
    user: User;

    post: Post;
    postId: number;

    comment?: Comment;
    commentId?: number;
    comments: Array<Comment>;

    status: 'Active' | 'Hidden';
}