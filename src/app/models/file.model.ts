import { Post } from "./post";
import { Request } from "./request.model";
import { Showcase } from "./showcase";
import { User } from "./user.model";

export class File {
    id: number;
    name: string;
    path: string;
    type: string;

    userId?: number;
    requestId?: number;
    postId?: number;
    showcaseId?: number;

    user?: User;
    endorse?: Request;
    post?: Post;
    showcase: Showcase;
}