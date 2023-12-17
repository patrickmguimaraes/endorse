import { User } from "./user.model";

export class Follower {
    followerId: number;
    follower: User;

    followedId: number;
    followed: User;
}