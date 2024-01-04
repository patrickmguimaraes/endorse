import { Category } from "./category.model";
import { City } from "./city.model";
import { Copyright } from "./copyright.model";
import { Industry } from "./industry.model";
import { User } from "./user.model";

export class Company {
    id: number;
    name: string;
    handle: string;
    type: string;
    founded: string;
    website: string;
    size: string;
    summary: string;
    linkedin: string;
    facebook: string;
    twitter: string;

    industryId: number = 0;
    industry?: Industry;

    cityId: number = 0;
    city?: City;

    copyrights: Array<Copyright>;
    user?: User;
}