import { model } from "mongoose";
import { IAlias } from "../interfaces/IAlias";
import { AliasSchema } from "../schemas/AliasSchema";

export const Alias = model<IAlias>("aliases", AliasSchema);
