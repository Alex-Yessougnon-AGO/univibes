import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdDto {
  @ApiProperty({ example: 'Boutique XYZ' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  advertiserName!: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...' })
  @IsString()
  bannerUrl!: string;

  @ApiPropertyOptional({ example: 'Cotonou' })
  @IsString()
  @IsOptional()
  targetCity?: string;

  @ApiPropertyOptional({ example: 'https://boutiquexyz.com' })
  @IsString()
  @IsOptional()
  clickUrl?: string;

  @ApiProperty()
  @IsDateString()
  startDate!: string;

  @ApiProperty()
  @IsDateString()
  endDate!: string;
}

export class UpdateAdDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  advertiserName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  targetCity?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clickUrl?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
