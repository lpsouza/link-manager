import { Schema } from "mongoose";
import { IHit } from "../interfaces/IHit";

export const HitSchema = new Schema<IHit>({
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
}, { timestamps: true });
