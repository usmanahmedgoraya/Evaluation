import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter the correct email" })
    readonly email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}