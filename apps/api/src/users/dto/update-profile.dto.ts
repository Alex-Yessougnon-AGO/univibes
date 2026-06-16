import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Jean Dupont' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullname?: string;

  @ApiPropertyOptional({ example: '+22997000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Cotonou' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: "Université d'Abomey-Calavi" })
  @IsString()
  @IsOptional()
  university?: string;

  @ApiPropertyOptional({ example: 'Informatique' })
  @IsString()
  @IsOptional()
  faculty?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}

export class UpdateUserRoleDto {
  @ApiPropertyOptional({ example: 'organizer' })
  role!: string;
}
