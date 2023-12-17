import { TermAndCondition } from "./term-and-condition.model";
import { User } from "./user.model";

export class UserTermAndCondition {
    id: number;
    date: Date;

    userId?: number;
    termAndConditionId?: number;

    user?: User;
    termAndCondition?: TermAndCondition;
}