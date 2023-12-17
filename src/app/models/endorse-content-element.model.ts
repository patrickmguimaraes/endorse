import { ContentElement } from "./content-element.model";
import { Endorse } from "./endorse.model";

export class EndorseContentElement {
    id: number;
    endorseId: number;
    contentElementsId: number;

    contentElement: ContentElement;
    endorse: Endorse;
}