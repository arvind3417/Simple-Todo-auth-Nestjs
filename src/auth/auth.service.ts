import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      const accessToken = await this.genAccessToken(user);
      const refreshToken = await this.genRefreshToken(user);
      console.log('hi');

      console.log(accessToken);

      //   return this.signToken(user.id, user.email);
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    const accessToken = await this.genAccessToken(user);
    const refreshToken = await this.genRefreshToken(user);
    // return this.signToken(user.id, user.email);
    return { accessToken, refreshToken };
  }

  async genRefreshToken(user: User): Promise<string> {
    console.log('refresh');

    console.log(user);

    const payload = { sub: user.id, email: user.email };
    const refrtoken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    return refrtoken;
  }
  async genAccessToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    console.log(`sub: ${user.id}`);
    
    return this.jwt.sign(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_ACCESS_SECRET'),
    });
  }
}
