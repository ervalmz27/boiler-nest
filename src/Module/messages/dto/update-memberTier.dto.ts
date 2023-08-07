import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './messages.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
