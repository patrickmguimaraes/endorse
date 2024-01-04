import { Company } from "./company.model";
import { RequestCopyright } from "./request-copyright.model";

export class Copyright {
    id: number;
    name: string = "";
    text: string = "";
    visibleToAllPeople: boolean = false;
    
    company?: Company;
    companyId: number;
}