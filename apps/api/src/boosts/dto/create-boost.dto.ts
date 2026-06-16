import { IsUUID, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoostDto {
  @ApiProperty()
  @IsUUID()
  eventId!: string;

  @ApiProperty({ example: 'h24' })
  @IsString()
  @IsIn(['h24', 'h72', 'days7'])
  boostType!: string;
}
