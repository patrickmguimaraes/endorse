import { RequestCopyright } from "./request-copyright.model";
import { Metric } from "./metric.model";

export class RequestCopyrightMetric {
    id: number;
    requestId: number;
    metricId: number;

    metric: Metric;
    request: RequestCopyright;
}