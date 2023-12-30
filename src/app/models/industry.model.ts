import { Company } from "./company.model";


export class Industry {
    id: number;
    name: string;
    
    companies: Array<Company> = [];
}