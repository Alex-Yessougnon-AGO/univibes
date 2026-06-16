import {
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ example: 'Soirée de rentrée UAC 2026' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional({ example: 'cat-uuid' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 'Venez nombreux pour la soirée de rentrée...' })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiProperty({ example: 'Amphi 500, Campus Abomey-Calavi' })
  @IsString()
  location!: string;

  @ApiProperty({ example: 'Cotonou' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: 6.3667 })
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 2.4333 })
  @IsOptional()
  longitude?: number;

  @ApiProperty({ example: '2026-10-15T18:00:00Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-10-15T23:00:00Z' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;
}

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Soirée de rentrée UAC 2026' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  longitude?: number;

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
  isFree?: boolean;
}

export class QueryEventsDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'approved' })
  @IsString()
  @IsOptional()
  status?: string;
}
