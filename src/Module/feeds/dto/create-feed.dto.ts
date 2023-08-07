import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedDTO {
  @IsString()
  content: string;
}
