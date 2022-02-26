import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email',
    example: 'user1@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'test123#',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
