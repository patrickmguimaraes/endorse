import { Showcase } from "./showcase";
import { ShowcaseTag } from "./showcase-tag";

export class Tag {
    id: number;
    name: string;

    showcaseTags: Array<ShowcaseTag> = [];
}