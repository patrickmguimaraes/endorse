import { State } from "./state.model";

export class Country {
    id: number;
    name: string;
    iso: string;
    iso3: string;
    nativeName: string;
    numcode: string;
    phonecode: string;
    capital: string;
    region: string;
    subRegion: string;
    currencyName: string;
    currency: string;
    currencySymbol: string;
    nationality: string;
    emojiU: string;
    tld: string;

    states: Array<State> = [];
}