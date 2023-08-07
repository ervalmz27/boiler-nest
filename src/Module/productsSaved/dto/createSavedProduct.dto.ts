import { IsNotEmpty } from 'class-validator';

export class CreateSavedProductDto {
  @IsNotEmpty()
  product_id: string;
}
