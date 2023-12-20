import { ComplianceMeasure } from "./compliance-measure.model";
import { Request } from "./request.model";

export class RequestComplianceMeasure {
    id: number;
    requestId: number;
    complianceMeasureId: number;

    complianceMeasure: ComplianceMeasure;
    request: Request;
}