import { IHit } from "./IHit";

export interface IAlias {
    name: string;
    url: string;
    hits?: IHit[];
    createdAt?: Date;
    updatedAt?: Date;
}
