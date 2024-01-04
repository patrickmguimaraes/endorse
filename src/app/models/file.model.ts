import { Post } from "./post";
import { RequestCopyright } from "./request-copyright.model";
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
    endorse?: RequestCopyright;
    post?: Post;
    showcase: Showcase;
}