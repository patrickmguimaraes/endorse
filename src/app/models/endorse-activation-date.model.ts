import { ActivationDate } from "./activation-date.model";

export class EndorseActivationDate {
    id: number;
    date: string = "";
    endorseId: number;
    activationDateId: number;
    activationDate: ActivationDate;
}