import { IsEnum } from "class-validator";
import { React } from "../schema/reaction.schema";

export class blogReactionDto{
    @IsEnum(React)
    type:React
}