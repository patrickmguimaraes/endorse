import { Agreement } from "./agreement.model";
import { User } from "./user.model";

export class UserAgreement {
    id: number;
    date: Date;

    userId?: number;
    agreementId?: number;

    user?: User;
    agreement?: Agreement;
}