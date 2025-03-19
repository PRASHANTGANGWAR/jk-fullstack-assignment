import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  first_name?: string;

  @ApiProperty()
  @IsOptional()
  last_name?: string;

  @ApiProperty()
  @IsOptional()
  phone_number?: string;
}
