import { User } from "./user.model";

export class UserSettings {
    id: number;
    newsletter: boolean;
    emailNotifications: boolean;

    userId?: number;
    user?: User;
}