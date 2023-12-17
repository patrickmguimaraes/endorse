import { Category } from "./category.model";
import { Copyright } from "./copyright.model";
import { User } from "./user.model";

export class Company {
    id: number;
    name: string = "";
    businessLocation: string = "";
    businessWebsite: string = "";
    businessSize: string = "";

    categoryId: number = 0;
    category?: Category;

    copyrights: Array<Copyright>;
    user?: User;
}