import { Endorse } from "./endorse.model";
import { Metric } from "./metric.model";

export class EndorseMetric {
    id: number;
    endorseId: number;
    metricId: number;

    metric: Metric;
    endorse: Endorse;
}