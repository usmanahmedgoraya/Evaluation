import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { Role, User } from './schema/user.schemas';
import { updateUserDto } from './dto/updateUser.dto';

@Controller('auth') 
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    // ======
    // SignUp
    // ======  
    @Post("/signup")
    @UseInterceptors(FileInterceptor('file'))
    async SignUp(
        @Body()
        signUpDto: CreateUserDto,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<{ token: string, user: {} }> {

        // Upload image and Returning the image url in the form of object
        const profileImage = await this.authService
            .uploadImage(file)
            .then((data) => {
                return {
                    statusCode: 200,
                    data: data.secure_url,
                };
            })
            .catch((err) => {
                return {
                    statusCode: 400,
                    message: err.message,
                };
            });

        return this.authService.signUp(signUpDto, profileImage)
    }

    // ==========
    // Login user
    // ==========

    @Post("/login")
    async login(
        @Body()
        loginDto: loginDto
    ): Promise<{ token: string, user: {} }> {
        return this.authService.login(loginDto)
    }

    // =================
    // block the User
    // =================

    @Put('block/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async blockUser(@Param('id') id: string) {
        return await this.authService.blockUser(id);
    }

    // =================
    // Unblock the User
    // =================
    @Put('unblock/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async unblock(@Param('id') id: string) {
        return await this.authService.unblockUser(id);
    }

    // =============
    // Get All Users
    // =============

    @Get('users')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ISADMIN)
    async allUser() {
        return await this.authService.getAllUser();
    }

    // =========================
    // Get a single User Profile
    // =========================
    @Get('profile/:id')
    @UseGuards(JwtAuthGuard)
    async GetProfile(
        @Param('id')
        id: string,
        @Req()
        req
    ) {
        return await this.authService.getUser(id, req.user);
    }

    // =============================
    // Send Email for reset password
    // =============================
    @Post("password")
    async sendEmailForReset(@Body() body: { email: string }): Promise<{ token: string }> {
        const { email } = body
        return await this.authService.sendEmailResetPassword(email)
    }

    // ==============================
    // verify OTP and reset password
    // ===============================
    @Post("reset-password")
    @UseGuards(JwtAuthGuard)
    async resetPassword(@Body() newPassword: { password: string, opt: string }, @Req() req): Promise<User> {

        return await this.authService.forgetPassword(newPassword, req.user.opt, req.user.user)
    }

    // ==============================
    // Update user Data
    // ===============================
    @Post("update-user")
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async updateUserData(@Body() updateUserDto: updateUserDto, @Req() req, @UploadedFile() file: Express.Multer.File,): Promise<User> {
        // Upload image and Returning the image url in the form of object
        const profileImage = await this.authService
            .uploadImage(file)
            .then((data) => {
                return {
                    statusCode: 200,
                    data: data.secure_url,
                };
            })
            .catch((err) => {
                return {
                    statusCode: 400,
                    message: err.message,
                };
            });

        return await this.authService.updateUser(updateUserDto, req.user,profileImage)
    }


}
