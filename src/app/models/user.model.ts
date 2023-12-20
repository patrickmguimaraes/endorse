import { Token } from "@angular/compiler";
import { Company } from "./company.model";
import { Contract } from "./contract.model";
import { File } from "./file.model";
import { Person } from "./person.model";
import { UserTermAndCondition } from "./user-term-and-condition.model";
import { Follower } from "./follower";
import { View } from "./view";
import { Post } from "./post";
import { RequestAssignment } from "./request-assignment.model";
import { RequestHistory } from "./request-history.model";

export class User {
    id: number;
    role: 'user' | 'admin';
    authId?: string;
    username?: string;
    email: string = "";
    password: string = "";
    type: "Person" | "Company" = "Person";
    phone: string = "";
   
    streetLine1: string = "";
    streetLine2: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    postalCode: string = "";
    
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;

    contractId: number;
    contract: Contract;

    companyId: number;
    company?: Company = new Company();

    personId: number;
    person?: Person = new Person();

    isEmailVerified: boolean = false;
    language?: string;
    location?: string;
    notification?: string;
    signupProvider?: string;
    signupProviderId?: string;
    date?: Date;
    removed?: Date;
    status: 'Active' | 'Deleted' | 'Pending' = 'Pending';

    requests: Array<Request> = [];
    requestAssignments: Array<RequestAssignment> = [];
    files: Array<File> = [];
    requestHistory: Array<RequestHistory> = [];
    userTermsAndConditions: Array<UserTermAndCondition> = [];
    //tokens: Array<Token> = [];
    followers: Array<Follower> = [];
    followeds: Array<Follower> = [];
    views: Array<View> = [];
    posts: Array<Post> = [];
}