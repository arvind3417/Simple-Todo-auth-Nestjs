import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { log } from 'console';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log("Validating user with payload: ", payload);
  
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
  
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
  
    delete user.hash;
  
    return user;
  }
  
  
}
