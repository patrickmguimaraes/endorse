import { GeograficScope } from "./geografic-scope.model";
import { RequestCopyright } from "./request-copyright.model";

export class RequestCopyrightGeograficScope {
    id: number;
    requestId: number;
    geograficScopeId: number;

    geograficScope: GeograficScope;
    request: RequestCopyright;
}