import { Category } from "./category.model";
import { File } from "./file.model";
import { Post } from "./post";
import { ShowcaseTag } from "./showcase-tag";
import { Tag } from "./tag";

export class Showcase {
    id: number;
    title: string = "";
    description: string = "";
    implementationPlan: string = "";
    challenges: string = "";

    post: Post;
    postId: number;

    category: Category;
    categoryId?: number;

    tags: Array<ShowcaseTag> = [];
    files: Array<File> = [];
}