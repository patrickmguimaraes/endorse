import { RequestCopyrightActivationDate } from "./request-copyright-activation-date.model";
import { RequestCopyrightAssignment } from "./request-copyright-assignment.model";
import { RequestCopyrightComplianceMeasure } from "./request-copyright-compliance-measure.model";
import { RequestCopyrightContentElement } from "./request-copyright-content-element.model";
import { RequestCopyrightGeograficScope } from "./request-copyright-geografic-scope.model";
import { RequestCopyrightHistory } from "./request-copyright-history.model";
import { RequestCopyrightMediaChannel } from "./request-copyright-media-channel.model";
import { RequestCopyrightMetric } from "./request-copyright-metric.model";
import { File } from "./file.model";
import { User } from "./user.model";

export class RequestCopyright {
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

    requestActivationDates: Array<RequestCopyrightActivationDate> = [];
    requestGeograficScopes: Array<RequestCopyrightGeograficScope> = [];
    requestMediasChannels: Array<RequestCopyrightMediaChannel> = [];
    requestContentElements: Array<RequestCopyrightContentElement> = [];
    requestComplianceMeasures: Array<RequestCopyrightComplianceMeasure> = [];
    requestMetrics: Array<RequestCopyrightMetric> = [];
    requestAssignments: Array<RequestCopyrightAssignment> = [];
    files: Array<File> = [];
    requestHistory: Array<RequestCopyrightHistory> = [];
}