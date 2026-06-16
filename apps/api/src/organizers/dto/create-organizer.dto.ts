import {
  IsString,
  IsOptional,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrganizerDto {
  @ApiProperty({ example: 'Club Informatique UAC' })
  @IsString()
  @MaxLength(200)
  organizationName!: string;

  @ApiPropertyOptional({ example: 'Club des passionnés de technologie...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://club-info-uac.com' })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/club_info_uac' })
  @IsString()
  @IsOptional()
  instagramUrl?: string;
}

export class UpdateOrganizerDto {
  @ApiPropertyOptional({ example: 'Club Informatique UAC' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  organizationName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instagramUrl?: string;
}
