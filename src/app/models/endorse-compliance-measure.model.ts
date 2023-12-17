import { ComplianceMeasure } from "./compliance-measure.model";
import { Endorse } from "./endorse.model";

export class EndorseComplianceMeasure {
    id: number;
    endorseId: number;
    complianceMeasureId: number;

    complianceMeasure: ComplianceMeasure;
    endorse: Endorse;
}