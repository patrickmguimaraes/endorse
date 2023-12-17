import { EndorseActivationDate } from "./endorse-activation-date.model";
import { EndorseAssignment } from "./endorse-assignment.model";
import { EndorseComplianceMeasure } from "./endorse-compliance-measure.model";
import { EndorseContentElement } from "./endorse-content-element.model";
import { EndorseGeograficScope } from "./endorse-geografic-scope.model";
import { EndorseHistory } from "./endorse-history.model";
import { EndorseMediaChannel } from "./endorse-media-channel.model";
import { EndorseMetric } from "./endorse-metric.model";
import { File } from "./file.model";
import { User } from "./user.model";

export class Endorse {
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

    endorseActivationDates: Array<EndorseActivationDate> = [];
    endorseGeograficScopes: Array<EndorseGeograficScope> = [];
    endorseMediasChannels: Array<EndorseMediaChannel> = [];
    endorseContentElements: Array<EndorseContentElement> = [];
    endorseComplianceMeasures: Array<EndorseComplianceMeasure> = [];
    endorseMetrics: Array<EndorseMetric> = [];
    endorseAssignments: Array<EndorseAssignment> = [];
    files: Array<File> = [];
    endorseHistory: Array<EndorseHistory> = [];
}