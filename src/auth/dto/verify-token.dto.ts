import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({
    description: 'Firebase ID token to verify',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
