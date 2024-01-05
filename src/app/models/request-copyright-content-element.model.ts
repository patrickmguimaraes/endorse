import { ContentElement } from "./content-element.model";
import { RequestCopyright } from "./request-copyright.model";

export class RequestCopyrightContentElement {
    id: number;
    requestId: number;
    contentElementId: number;

    contentElement: ContentElement;
    request: RequestCopyright;
}