import { Post } from "./post";
import { User } from "./user.model";

export class View {
    userId: number;
    user: User;

    postId: number;
    post: Post;
}