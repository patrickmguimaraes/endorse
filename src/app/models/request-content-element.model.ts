import { ContentElement } from "./content-element.model";
import { Request } from "./request.model";

export class RequestContentElement {
    id: number;
    requestId: number;
    contentElementsId: number;

    contentElement: ContentElement;
    request: Request;
}