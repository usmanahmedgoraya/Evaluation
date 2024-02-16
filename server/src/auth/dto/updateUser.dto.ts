import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { Role, UserStatus } from '../schema/user.schemas';
import { Optional } from '@nestjs/common';

export class updateUserDto {

    @ApiProperty()
    // @IsString()
    readonly name: string;

    @ApiProperty()
    // @IsString()
    readonly email: string;

    @ApiProperty()
    readonly profileImage:string


    @ApiProperty()
    // @IsString()
    // @MinLength(6)
    // @IsStrongPassword()
    @Optional()
    readonly password: string;

    // @IsEnum(UserStatus)
    // readonly userStatus: UserStatus

    // @IsEnum(Role)
    readonly role:Role
}