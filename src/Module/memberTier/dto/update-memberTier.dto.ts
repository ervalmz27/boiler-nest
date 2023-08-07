import { PartialType } from '@nestjs/swagger';
import { CreateMemberTierDto } from './create-memberTier.dto';

export class UpdateMemberTierDto extends PartialType(CreateMemberTierDto) {}
