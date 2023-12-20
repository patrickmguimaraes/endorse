import { Request } from "./request.model";
import { Metric } from "./metric.model";

export class RequestMetric {
    id: number;
    requestId: number;
    metricId: number;

    metric: Metric;
    request: Request;
}