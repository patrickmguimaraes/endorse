import { ActivationDate } from "./activation-date.model";

export class RequestActivationDate {
    id: number;
    date: string = "";
    requestId: number;
    activationDateId: number;
    activationDate: ActivationDate;
}