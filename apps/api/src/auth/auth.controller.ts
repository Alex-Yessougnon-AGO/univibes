import {
  Controller,
  Post,
  Body,
  Ip,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  RefreshTokenDto,
} from './dto/register.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from './interfaces/auth.types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({
    summary: "Cr\u00e9er un compte \u00e9tudiant",
    description: "Inscription d'un nouvel \u00e9tudiant. Cr\u00e9e un profil, g\u00e9n\u00e8re un token de v\u00e9rification et retourne les tokens JWT.",
  })
  @ApiBody({ type: RegisterDto, description: "Informations d'inscription" })
  @ApiResponse({ status: 201, description: 'Compte cr\u00e9\u00e9 avec succ\u00e8s' })
  @ApiResponse({ status: 409, description: 'Email d\u00e9j\u00e0 utilis\u00e9' })
  async register(@Body() dto: RegisterDto, @Ip() ip: string) {
    return this.authService.register(dto, ip);
  }

  @Post('login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Connecter un utilisateur',
    description: 'Authentifie un utilisateur avec email et mot de passe. Retourne les tokens JWT access + refresh.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion r\u00e9ussie' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  async login(@Body() dto: LoginDto, @Ip() ip: string) {
    return this.authService.login(dto, ip);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "D\u00e9connecter l'utilisateur",
    description: 'Invalide le refresh token. Si aucun token fourni, tous les refresh tokens sont invalid\u00e9s.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', description: 'Token \u00e0 invalider (optionnel)' },
      },
    },
    required: false,
  })
  @ApiResponse({ status: 204, description: 'D\u00e9connexion r\u00e9ussie' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body('refreshToken') refreshToken?: string,
  ) {
    await this.authService.logout(user.id, refreshToken);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rafra\u00eechir les tokens',
    description: '\u00c9change un refresh token valide contre une nouvelle paire access + refresh tokens.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Tokens rafra\u00eechis' })
  @ApiResponse({ status: 401, description: 'Refresh token invalide ou expir\u00e9' })
  async refresh(@Body() dto: RefreshTokenDto, @Ip() ip: string) {
    return this.authService.refreshTokens(dto.refreshToken, ip);
  }

  @Post('verify-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "V\u00e9rifier l'adresse email",
    description: "Valide l'email d'un utilisateur \u00e0 l'aide du token de v\u00e9rification re\u00e7u par email.",
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', description: 'Token de v\u00e9rification' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Email v\u00e9rifi\u00e9 avec succ\u00e8s' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expir\u00e9' })
  async verifyEmail(@Body('token') token: string) {
    await this.authService.verifyEmail(token);
    return { message: 'Email v\u00e9rifi\u00e9 avec succ\u00e8s.' };
  }

  @Post('resend-verification')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: "Renvoyer l'email de v\u00e9rification",
    description: "G\u00e9n\u00e8re un nouveau token et envoie un email de v\u00e9rification \u00e0 l'utilisateur connect\u00e9.",
  })
  @ApiResponse({ status: 200, description: 'Email de v\u00e9rification renvoy\u00e9' })
  @ApiResponse({ status: 400, description: 'Email d\u00e9j\u00e0 v\u00e9rifi\u00e9' })
  async resendVerification(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.resendVerificationEmail(user.id);
    return { message: 'Email de v\u00e9rification renvoy\u00e9. V\u00e9rifiez votre bo\u00eete de r\u00e9ception.' };
  }

  @Post('forgot-password')
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Demander la r\u00e9initialisation du mot de passe',
    description: "Envoie un email avec un lien de r\u00e9initialisation si le compte existe. Ne r\u00e9v\u00e8le pas si le compte existe ou non.",
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Email envoy\u00e9 si le compte existe' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return {
      message:
        'Si un compte existe avec cet email, un lien de r\u00e9initialisation a \u00e9t\u00e9 envoy\u00e9.',
    };
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'R\u00e9initialiser le mot de passe',
    description: "R\u00e9initialise le mot de passe \u00e0 l'aide du token re\u00e7u par email.",
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Mot de passe r\u00e9initialis\u00e9' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expir\u00e9' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Mot de passe r\u00e9initialis\u00e9 avec succ\u00e8s.' };
  }
}
