import { City } from "./city.model";
import { Country } from "./country.model";


export class State {
    id: number;
    name: string;
    stateCode: string;

    countryId: number;
    country: Country;

    cities: Array<City> = [];
}