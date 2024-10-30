import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../auth/schemas/user.schema";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})

export class Coin {
    @Prop()
    code: string;

    @Prop()
    name: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);