import { Collaboration } from "./collaboration.model";
import { Tag } from "./tag";

export class CollaborationTag {
    originalTag: string;
    
    tag: Tag;
    tagId: number;

    collaboration: Collaboration;
    collaborationId: number;
}