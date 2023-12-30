import { ActivationDate } from "./activation-date.model";
import { RequestCopyright } from "./request-copyright.model";

export class RequestCopyrightActivationDate {
    id: number;
    date: string = "";
    
    requestId: number;
    reuqest: RequestCopyright;
    
    activationDateId: number;
    activationDate: ActivationDate;
}