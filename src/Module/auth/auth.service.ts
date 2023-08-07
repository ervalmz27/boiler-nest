import { Injectable } from '@nestjs/common';
import { AdminsService } from '../admin/admins.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email, password) {
    const userDetail = await this.adminService.findByEmail(email);

    if (userDetail === null) {
      return false;
    }

    const payload = {
      userId: userDetail.id,
      email: userDetail.email,
      name: userDetail.name,
      role: 'ADMIN',
    };

    const compared = await this.comparePassword(password, userDetail.password);

    delete userDetail['password'];
    if (compared) {
      return {
        ...userDetail,
        access_token: this.jwtService.sign(payload),
      };
    }
    return false;
  }

  async comparePassword(enteredPassword: string, dbPassword: string) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  async getProfile(email) {
    return await this.adminService.findByEmail(email);
  }

  async updateProfile(id, payload) {
    return await this.adminService.update(id, payload);
  }
}
