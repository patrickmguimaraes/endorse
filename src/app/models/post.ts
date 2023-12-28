import { Article } from "./article";
import { Collaboration } from "./collaboration.model";
import { Endorse } from "./endorse";
import { File } from "./file.model";
import { Idea } from "./idea";
import { Power } from "./power";
import { Showcase } from "./showcase";
import { User } from "./user.model";
import { View } from "./view";

export class Post {
    id: number;
    date: Date = new Date();
    
    articleId?: number;
    article: Article;

    ideaId: number;
    idea: Idea;

    powers: number;
    endorsements: number;

    user: User;
    userId: number;

    powersObject: Array<Power>;
    endorsementsObject: Array<Endorse>;

    link: string;

    status: 'Posted' | 'Hidden';

    views: Array<View> = [];
    files: Array<File> = [];
    showcase: Showcase;
    collaborations: Array<Collaboration> = [];
}