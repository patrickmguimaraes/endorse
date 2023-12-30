import { Address } from "./address.model";
import { Company } from "./company.model";
import { State } from "./state.model";

export class City {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    wikiDataId: string;

    stateId: number;
    state: State;

    address: Array<Address> = [];
    companies: Array<Company> = [];
}