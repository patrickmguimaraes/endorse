import { UserTermAndCondition } from "./user-term-and-condition.model";

export class TermAndCondition {
    id?: number;
    name?: string;
    text: string = "";

    userTermsAndConditions?: Array<UserTermAndCondition> = []
}