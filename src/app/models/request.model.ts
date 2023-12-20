import { RequestActivationDate } from "./request-activation-date.model";
import { RequestAssignment } from "./request-assignment.model";
import { RequestComplianceMeasure } from "./request-compliance-measure.model";
import { RequestContentElement } from "./request-content-element.model";
import { RequestGeograficScope } from "./request-geografic-scope.model";
import { RequestHistory } from "./request-history.model";
import { RequestMediaChannel } from "./request-media-channel.model";
import { RequestMetric } from "./request-metric.model";
import { File } from "./file.model";
import { User } from "./user.model";

export class Request {
    id: number;
    name: string = "";
    description: string = "";
    objective: string = "";
    start: string = new Date(new Date().getTime() + 86400000).toISOString().substring(0, 10);
    end: string = new Date(new Date().getTime() + 2592000000).toISOString().substring(0, 10);
    startDate: Date = new Date(new Date().getTime() + 86400000);
    endDate: Date = new Date(new Date().getTime() + 2592000000);
    attributionDetails: string = "";
    reportingFrequency: string = "";
    
    requestText: string = "";

    userId: number = 0;
    user: User;
    categoryId: number = 0;
    assignEmployerId: number = 0;
    companyId: number = 0;
    copyrightId: number = 0;

    visibility: string = "";
    picture: string = '';
    status: "In Progress" = "In Progress"

    requestActivationDates: Array<RequestActivationDate> = [];
    requestGeograficScopes: Array<RequestGeograficScope> = [];
    requestMediasChannels: Array<RequestMediaChannel> = [];
    requestContentElements: Array<RequestContentElement> = [];
    requestComplianceMeasures: Array<RequestComplianceMeasure> = [];
    requestMetrics: Array<RequestMetric> = [];
    requestAssignments: Array<RequestAssignment> = [];
    files: Array<File> = [];
    requestHistory: Array<RequestHistory> = [];
}