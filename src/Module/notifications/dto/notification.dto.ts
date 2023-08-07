import { IsString } from 'class-validator';

export class NotificationDto {
  @IsString()
  type: string;

  @IsString()
  destination: string;

  @IsString()
  content: string;
}
