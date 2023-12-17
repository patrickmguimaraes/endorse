import { Company } from "./company.model";

export class Category {
    id: number;
    name: string;

    companies?: Array<Company> = [];
}