import { Schema } from "mongoose";
import { IAlias } from "../interfaces/IAlias";
import { HitSchema } from "./HitSchema";

export const AliasSchema = new Schema<IAlias>({
    name: { type: String, required: true },
    url: { type: String, required: true },
    hits: [HitSchema],
}, { timestamps: true });
