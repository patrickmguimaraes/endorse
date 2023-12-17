import { User } from "./user.model";

export class Person {
    id: number;
    name: string = "";
    surname: string = "";
    birth: string = new Date().toISOString().substring(0, 10);
    gender: string = "";
    profession: string = "";

    user?: User;
}