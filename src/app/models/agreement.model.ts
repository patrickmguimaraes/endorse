import { UserAgreement } from "./user-agreement.model";

export class Agreement {
    id?: number;
    name?: string;
    text: string = "";
    type: "Cookies Policy" | "Terms and Conditions" | "Privacy Policy" = "Terms and Conditions";

    userAgreements?: Array<UserAgreement> = []
}