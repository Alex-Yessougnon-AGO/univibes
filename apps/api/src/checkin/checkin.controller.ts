import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CheckinService } from './checkin.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';
import { Public } from '../common/decorators/public.decorator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScanQrDto {
  @ApiProperty({ example: 'UV-ABC123DEF456', description: 'Code QR du billet' })
  @IsString()
  qrCode!: string;
}

export class CheckinResponseDto {
  @ApiProperty()
  success!: boolean;

  @ApiProperty()
  message!: string;

  @ApiProperty({ required: false })
  attendee?: {
    name: string;
    ticketName: string;
    eventName: string;
  };
}

@ApiTags('checkin')
@Controller('checkin')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post('scan')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin', 'moderator')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Scanner un QR code',
    description: "V\u00e9rifie et valide un billet par son QR code. N\u00e9cessite d'\u00eatre organisateur, mod\u00e9rateur ou admin.",
  })
  @ApiBody({ type: ScanQrDto })
  @ApiResponse({ status: 200, description: 'Billet valide' })
  @ApiResponse({ status: 404, description: 'QR code invalide' })
  @ApiResponse({ status: 409, description: 'Billet d\u00e9j\u00e0 scann\u00e9' })
  async scan(@Body() dto: ScanQrDto) {
    return this.checkinService.verifyAndCheckin(dto.qrCode);
  }

  @Get(':qrCode')
  @Public()
  @ApiOperation({
    summary: 'V\u00e9rifier un QR code',
    description: "V\u00e9rifie si un QR code est valide sans le marquer comme utilis\u00e9. Accessible publiquement.",
  })
  @ApiParam({ name: 'qrCode', required: true, type: String, description: 'Code QR du billet' })
  @ApiResponse({ status: 200, description: 'Statut du billet' })
  async verify(@Param('qrCode') qrCode: string) {
    return this.checkinService.verify(qrCode);
  }
}
