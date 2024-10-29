import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})

export class Coin {
    @Prop()
    code: string;

    @Prop()
    name: string;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);