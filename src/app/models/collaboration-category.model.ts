export class CollaborationCategory {
    id: number;
    name: string;

    father: CollaborationCategory;
    fatherId: CollaborationCategory;

    children: Array<CollaborationCategory> = [];
}