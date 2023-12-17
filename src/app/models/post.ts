import { Comment } from "./comment";
import { Like } from "./like";
import { User } from "./user.model";
import { View } from "./view";

export class Post {
    id: number;
    date: Date = new Date();
    type?: 'Text' | 'Image' | 'Video' | 'Endorse';
    text?: string;
    image?: string;
    video?: string;
    
    likes: number;
    comments: number;
    endorsements: number;

    user: User;
    userId: number;

    likesObject: Array<Like>;
    commentsObject: Array<Comment>;
    endorsementsObject: Array<Post>;

    link: string;

    status: 'Posted' | 'Hidden';

    views: Array<View> = [];
}