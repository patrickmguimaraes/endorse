import { CollaborationRequest } from "./collaboration-request";
import { JobCategory } from "./job-category.model";
import { Post } from "./post";

export class Collaboration {
    id: number;
    title: string = "";
    description: string = "";
    workingExperience: string  = "";
    jobType: string = "";
    vacacies: number = 1;
    salary: string;
    deadline: Date;
    skils: string;

    post: Post;
    postId: number;

    category: JobCategory;
    categoryId: number;

    requests: Array<CollaborationRequest>;
}