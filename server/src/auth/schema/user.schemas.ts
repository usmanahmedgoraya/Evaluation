import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum UserStatus {
    BLOCK = 'Block',
    UNBLOCK = 'Unblock',
}

export enum Role {
    ISADMIN = 'admin',
    ISWRITER = 'writer',
    USER = 'user'
}

@Schema()
export class User extends Document {
    @Prop()
    name: string;

    @Prop({ unique: [true, "Duplicate email enter"] })
    email: string;
   
    @Prop()
    password: string;

    @Prop()
    profileImage:string

    @Prop({ default: "Unblock" })
    userStatus: UserStatus

    @Prop({default:"user"})
    role: Role
}

export const UserSchema = SchemaFactory.createForClass(User);