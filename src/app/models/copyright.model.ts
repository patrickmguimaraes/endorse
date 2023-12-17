import { Company } from "./company.model";

export class Copyright {
    id: number;
    name: string = "";
    text: string = "";
    
    company?: Company;
    companyId: number;
}