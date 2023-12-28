import { CollaborationCategory } from "./collaboration-category.model";
import { CollaborationRequest } from "./collaboration-request.model";
import { CollaborationTag } from "./collaboration-tag.model";
import { Post } from "./post";

export class Collaboration {
    id: number;
    title: string;
    description: string;
    workingExperience: string;
    vacacies: number = 1;
    salary: string;
    deadline: Date;

    post: Post;
    postId: number;

    collaborationCategory: CollaborationCategory;
    collaborationCategoryId: number;

    requests: Array<CollaborationRequest> = [];
    skills: Array<CollaborationTag> = [];
}