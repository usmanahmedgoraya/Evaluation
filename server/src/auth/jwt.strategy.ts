import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport"
import { User } from './schema/user.schemas';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });

    }

    async validate(payload: { id: any, otp: string }) {

        const { id, otp } = payload;
        // Get the user from id
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint');
        }

        // Check if OTP exist then it give different response on request
        if (otp) {
            const reset = { user, otp: otp };
            return reset
        }
        // Returning user
        return user
    }

}