import { Post } from "./post";
import { User } from "./user.model";

export class Like {
    id: number;

    userId: number;
    user: User;

    post: Post;
    postId: number;
}