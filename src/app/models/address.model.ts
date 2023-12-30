import { City } from "./city.model";
import { Company } from "./company.model";

export class Address {
    id: number;
    name: string;
    postalCode: string;
    streetAddress: string;
    addressLine2: string;

    cityId: number;
    city: City;

    companies: Array<Company> = [];
}