import {
  Controller,
  Get,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { DebugService, DebugLogEntry } from './debug.service';

@ApiTags('debug')
@Controller('debug')
export class DebugController {
  private readonly logger = new Logger(DebugController.name);

  constructor(private readonly debugService: DebugService) {}

  @Get('logs')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logs r\u00e9cents (dev only)',
    description: 'Retourne les logs r\u00e9cents de l\'API. Uniquement accessible en mode d\u00e9veloppement.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs r\u00e9cents',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            entries: { type: 'array', items: { type: 'object' } },
            total: { type: 'number' },
          },
        },
      },
    },
  })
  async getLogs() {
    this.debugService.checkDevMode();
    return this.debugService.getLogs();
  }

  @Get('errors')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Erreurs r\u00e9centes (dev only)',
    description: 'Retourne les erreurs r\u00e9centes captur\u00e9es par l\'API. Uniquement en mode d\u00e9veloppement.',
  })
  @ApiResponse({ status: 200, description: 'Erreurs r\u00e9centes' })
  async getErrors() {
    this.debugService.checkDevMode();
    return this.debugService.getErrors();
  }

  @Get('config')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Configuration (dev only)',
    description: 'Retourne la configuration de l\'API (variables d\'environnement masqu\u00e9es). Uniquement en mode d\u00e9veloppement.',
  })
  @ApiResponse({ status: 200, description: 'Configuration' })
  async getConfig() {
    this.debugService.checkDevMode();
    return this.debugService.getSanitizedConfig();
  }

  @Get('health')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sant\u00e9 d\u00e9taill\u00e9e (dev only)',
    description: 'Retourne la sant\u00e9 d\u00e9taill\u00e9e avec les temps de r\u00e9ponse et les statistiques de la base. Uniquement en mode d\u00e9veloppement.',
  })
  @ApiResponse({ status: 200, description: 'Sant\u00e9 d\u00e9taill\u00e9e' })
  async getHealth() {
    this.debugService.checkDevMode();
    return this.debugService.getDetailedHealth();
  }

  @Get('audit')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logs d\'audit r\u00e9cents (dev only)',
    description: 'Retourne les logs d\'audit r\u00e9cents. Uniquement en mode d\u00e9veloppement.',
  })
  @ApiResponse({ status: 200, description: 'Logs d\'audit r\u00e9cents' })
  async getAuditLogs() {
    this.debugService.checkDevMode();
    return this.debugService.getAuditLogs();
  }

  @Get('routes')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des routes (dev only)',
    description: 'Retourne toutes les routes enregistr\u00e9es de l\'API. Uniquement en mode d\u00e9veloppement.',
  })
  @ApiResponse({ status: 200, description: 'Routes enregistr\u00e9es' })
  async getRoutes() {
    this.debugService.checkDevMode();
    return this.debugService.getRoutes();
  }

  @Get('clear')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Vider le buffer de logs (dev only)',
    description: 'Vide le buffer de logs en m\u00e9moire. Uniquement en mode d\u00e9veloppement.',
  })
  @ApiResponse({ status: 200, description: 'Buffer vid\u00e9' })
  async clearLogs() {
    this.debugService.checkDevMode();
    this.debugService.clear();
    return { message: 'Buffer de logs vid\u00e9.' };
  }
}
