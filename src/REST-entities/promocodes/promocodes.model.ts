import mongoose, { Schema } from "mongoose";
import {
    IPromo
} from "../../helpers/typescript-helpers/interfaces";

const userSchema = new Schema(
    {
        discount: Number,
        type: String,
        promo: String,
        period: {from: String, to: String},
        isUsing: Boolean
    }
);

export default mongoose.model<IPromo>("Promocodes", userSchema);
