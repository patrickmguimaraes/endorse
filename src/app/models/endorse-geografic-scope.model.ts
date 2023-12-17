import { Endorse } from "./endorse.model";
import { GeograficScope } from "./geografic-scope.model";

export class EndorseGeograficScope {
    id: number;
    endorseId: number;
    geograficScopeId: number;

    geograficScope: GeograficScope;
    endorse: Endorse;
}