import { Request } from "./request.model";
import { GeograficScope } from "./geografic-scope.model";

export class RequestGeograficScope {
    id: number;
    requestId: number;
    geograficScopeId: number;

    geograficScope: GeograficScope;
    request: Request;
}