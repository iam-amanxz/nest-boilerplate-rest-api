import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource name',
    example: 'Sample Resource',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
