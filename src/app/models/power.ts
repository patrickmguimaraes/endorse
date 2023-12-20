import { Post } from "./post";
import { User } from "./user.model";

export class Power {
    id: number;

    userId: number;
    user: User;

    post: Post;
    postId: number;
}