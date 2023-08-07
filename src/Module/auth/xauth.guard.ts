import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MembersService } from '../member/members.service';

@Injectable()
export class XAuthGuards implements CanActivate {
  constructor(private readonly memberService: MembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (typeof request.headers['x-api-key'] === 'undefined') {
      throw new UnauthorizedException();
    }

    const token = request.headers['x-api-key'];
    if (!token || token === '') {
      throw new UnauthorizedException();
    }
    const memberdata = await this.memberService.getSimpleProfile(token);
    if (memberdata === null) {
      throw new UnauthorizedException();
    }

    request['userToken'] = token;
    request['user'] = memberdata;
    return true;
  }
}
