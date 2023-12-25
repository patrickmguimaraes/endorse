import { User } from "./user.model";

export class Person {
    id: number;
    name: string = "";
    surname: string = "";
    birth: Date;
    gender: string = "";
    profession: string = "";

    user?: User;
}