import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import mongoose from 'mongoose';
import { loginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/sign-up.dto';
import { Role, User, UserStatus } from './schema/user.schemas';
import toStream = require('buffer-to-stream');
import { updateUserDto } from './dto/updateUser.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,
        private jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) { }

    // ===========
    // Signup User
    // ===========
    async signUp(signUpDto: CreateUserDto, profileImage: any): Promise<{ token: string, user: {} }> {
        const { name, email, password, userStatus, role } = signUpDto
        const existedUser = await this.userModel.findOne({ email })
        if (existedUser) {
            throw new ConflictException('User already existed with this email')
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds)

        const user = await this.userModel.create({
            name,
            email,
            password: hash,
            userStatus,
            role,
            profileImage: profileImage.data
        })

        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            userStatus: user.userStatus,
            role: user.role,
            profileImage: user.profileImage
        }
        const token = this.jwtService.sign({ id: user._id });
        return { token, user: newUser }
    }

    // ===========
    // Login User 
    // ===========  
    async login(loginDto: loginDto,): Promise<{ token: string, user: {} }> {
        const { email, password } = loginDto
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password')
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Invalid email or password')
        }

        if (user.userStatus === "Block") {
            throw new UnauthorizedException('You are not allowed to login')
        }

        const newUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            userStatus: user.userStatus,
            role: user.role,
            profileImage: user.profileImage
        }
        const token = this.jwtService.sign({ id: user._id });
        return { token, user: newUser }
    }

    // =======================
    // Get all Users by Admin
    // =======================

    async getAllUser(): Promise<User[]> {
        return await this.userModel.find()
    }

    // =====================
    // Blocked Blog By Admin
    // =====================
    async blockUser(id: string): Promise<User> {
        const user = await this.userModel.findById(id)
        if (user.role === Role.ISADMIN) {
            throw new UnauthorizedException('Admin not allowed to block admin')
        }
        if (user.userStatus === UserStatus.BLOCK) {
            throw new ConflictException('User is already block')
        }
        user.userStatus = UserStatus.BLOCK
        user.save()
        return user;
    }

    // =======================
    // UnBlocked Blog By Admin
    // =======================
    async unblockUser(id: string): Promise<User> {
        const user = await this.userModel.findById(id)
        if (user.role === Role.ISADMIN) {
            throw new UnauthorizedException('Admin not allowed to unblock admin')
        }
        if (user.userStatus === UserStatus.UNBLOCK) {
            throw new ConflictException('User is already Unblock')
        }
        user.userStatus = UserStatus.UNBLOCK
        user.save()
        return user;
    }

    // =======================
    // Get user from user Id
    // =======================
    async getUser(id: string, user: User): Promise<User> {
        if (user.role === Role.ISADMIN) {
            const userData = await this.userModel.findById(id)
            return userData;
        }
        if (id !== user._id.toString()) {
            throw new UnauthorizedException('Not Allowed')
        }
        const userData = await this.userModel.findById(id)
        return userData;
    }



    // ============
    // Upload image
    // ============
    async uploadImage(
        fileName: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        return new Promise((resolve, reject) => {
            v2.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_API_KEY,
                api_secret: process.env.CLOUD_API_SECRET,
            });

            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            toStream(fileName.buffer).pipe(upload);
        });
    }


    // ==============================
    // Send Email for reset password
    // ==============================
    async sendEmailResetPassword(email: string): Promise<{ token: string }> {
        // Find user with email
        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            throw new NotFoundException('User Not Found')
        }

        // generate random OTP 4-digit code
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Create a JWT token of user id and otp
        const token = this.jwtService.sign({ id: user._id, otp: otp });

        // Send Mail to user with otp
        await this.sendMail(email, otp);

        return { token }

    }

    // ================
    // Forget Password
    // ================

    async forgetPassword(newPassword: { password: string, opt: string }, savedOtp: string, user: User): Promise<User> {

        const { opt, password } = newPassword
        // Check if otp is not matched with user given OTP
        if (opt !== savedOtp) {
            throw new UnauthorizedException('Please Enter Correct OTP')
        }

        // Creating Hash and salt of Password
        const saltOrRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltOrRounds)

        // Update Password
        const passwordUpdated = await this.userModel.findByIdAndUpdate(user._id, { password: hashPassword }, { new: true })
        return passwordUpdated

    }

    // =========
    // Send Mail
    // =========

    async sendMail(recieverMail, otp) {
        this.mailerService.sendMail({
            to: recieverMail,
            from: "gorayausman061@gmail.com",
            subject: "Forget Password",
            text: 'Forget Password Hello',
            html: `<h1>The Reset Password OTP is ${otp}</h1>`
        })
    }

    // ===============
    // Update User
    // ===============

    async updateUser(updateUserDto: updateUserDto, user: User, profileImage:any): Promise<User> {
        if (!user) {
            throw new UnauthorizedException('Not Allowed')
        }

        const { email, name, role, password } = updateUserDto
        let data = { email, name, profileImage: profileImage?.data }
        // if (updateUserDto.password) {
        //     // Creating Hash and salt of Password
        //     const saltOrRounds:number = 10;
        //     const hashPassword = await bcrypt.hash(password, saltOrRounds)
        //     data.password = hashPassword 
        // }

        const updatedUser = await this.userModel.findByIdAndUpdate(user._id, data, { new: true })
        return updatedUser;
    }
}
