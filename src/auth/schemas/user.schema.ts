import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    name: string;

    @Prop({unique: [true, 'Este email já existe']})
    email: string;

    @Prop()
    password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);