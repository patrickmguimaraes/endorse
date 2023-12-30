import { ComplianceMeasure } from "./compliance-measure.model";
import { RequestCopyright } from "./request-copyright.model";

export class RequestCopyrightComplianceMeasure {
    id: number;
    requestId: number;
    complianceMeasureId: number;

    complianceMeasure: ComplianceMeasure;
    request: RequestCopyright;
}