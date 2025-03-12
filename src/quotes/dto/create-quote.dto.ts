import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuoteDto {
  @ApiProperty({
    example: 1000000,
    description: 'Amount to convert',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'ARS',
    description: 'Source currency code (e.g. ARS, USD, BTC)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  from: string;

  @ApiProperty({
    example: 'ETH',
    description: 'Target currency code (e.g. ETH, USD, ARS)',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  to: string;
}
