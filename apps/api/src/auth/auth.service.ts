import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { RegisterDto, LoginDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/auth.types';
import { AuthResponse, AuthTokens } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly audit: AuditService,
  ) {
    if (process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
    }
  }

  private resend?: Resend;

  async register(dto: RegisterDto, ipAddress?: string): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Un compte avec cet email existe déjà.',
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        profile: {
          create: {
            fullname: dto.fullname,
            phone: dto.phone,
            city: dto.city,
            university: dto.university,
          },
        },
      },
      include: { profile: true },
    });

    // Créer un token de vérification d'email
    const verificationToken = uuidv4();
    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    this.logger.log(`Nouvel utilisateur: ${user.email}`);
    await this.audit.log({
      actorId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: user.id,
      ipAddress,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullname: user.profile!.fullname,
        avatarUrl: user.profile!.avatarUrl,
      },
      tokens,
    };
  }

  async login(dto: LoginDto, ipAddress?: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect.',
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_DISABLED',
        message: 'Ce compte a été désactivé. Contactez un administrateur.',
      });
    }

    const validPassword = await bcrypt.compare(dto.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Email ou mot de passe incorrect.',
      });
    }

    this.logger.log(`Connexion: ${user.email}`);
    await this.audit.log({
      actorId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullname: user.profile!.fullname,
        avatarUrl: user.profile!.avatarUrl,
      },
      tokens,
    };
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    } else {
      await this.prisma.refreshToken.deleteMany({ where: { userId } });
    }

    await this.audit.log({
      actorId: userId,
      action: 'USER_LOGOUT',
      entityType: 'user',
      entityId: userId,
    });
  }

  async refreshTokens(refreshToken: string, ipAddress?: string): Promise<AuthTokens> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { profile: true } } },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Token de rafraîchissement invalide ou expiré.',
      });
    }

    // Supprimer l'ancien token
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });

    // Générer de nouveaux tokens
    const tokens = await this.generateTokens(
      stored.user.id,
      stored.user.email,
      stored.user.role,
    );

    await this.audit.log({
      actorId: stored.user.id,
      action: 'TOKEN_REFRESHED',
      entityType: 'user',
      entityId: stored.user.id,
      ipAddress,
    });

    return tokens;
  }

  async verifyEmail(token: string): Promise<void> {
    const verification = await this.prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new BadRequestException({
        code: 'INVALID_VERIFICATION_TOKEN',
        message: 'Token de vérification invalide ou expiré.',
      });
    }

    await this.prisma.user.update({
      where: { id: verification.userId },
      data: { emailVerified: true },
    });

    await this.prisma.emailVerification.delete({ where: { id: verification.id } });

    this.logger.log(`Email vérifié: userId=${verification.userId}`);
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new BadRequestException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    if (user.emailVerified) {
      throw new BadRequestException({
        code: 'EMAIL_ALREADY_VERIFIED',
        message: 'Votre email est d\u00e9j\u00e0 v\u00e9rifi\u00e9.',
      });
    }

    // Supprimer les anciens tokens
    await this.prisma.emailVerification.deleteMany({ where: { userId } });

    // Cr\u00e9er un nouveau token
    const token = uuidv4();
    await this.prisma.emailVerification.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    // Envoyer l\'email via Resend
    if (this.resend) {
      const verificationUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/verify-email/${token}`;
      const fullname = user.profile?.fullname ?? 'Utilisateur';

      await this.resend.emails.send({
        from: process.env.RESEND_FROM ?? 'noreply@univibes.com',
        to: user.email,
        subject: "V\u00e9rifiez votre adresse email - UnivVibes",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2>Bienvenue sur UnivVibes, ${fullname} !</h2>
          <p>Cliquez sur le lien ci-dessous pour v\u00e9rifier votre adresse email :</p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0">
            V\u00e9rifier mon email
          </a>
          <p style="color:#6b7280;font-size:14px">Ce lien expire dans 24h.</p>
        </div>`,
      });
    } else {
      this.logger.warn("Resend non configur\u00e9 (RESEND_API_KEY manquant). Token de v\u00e9rification cr\u00e9\u00e9 sans envoi email.");
    }

    this.logger.log(`Email de v\u00e9rification renvoy\u00e9: ${user.email}`);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    if (!user) {
      // Ne pas révéler si l'email existe ou pas
      return;
    }

    const token = uuidv4();
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
      },
    });

    // Envoyer l'email via Resend
    if (this.resend) {
      const resetUrl = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/reset-password/${token}`;
      const fullname = user.profile?.fullname ?? 'Utilisateur';

      await this.resend.emails.send({
        from: process.env.RESEND_FROM ?? 'noreply@univibes.com',
        to: user.email,
        subject: 'R\u00e9initialisation de mot de passe - UnivVibes',
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2>Bonjour ${fullname},</h2>
          <p>Vous avez demand\u00e9 la r\u00e9initialisation de votre mot de passe UnivVibes.</p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0">
            R\u00e9initialiser mon mot de passe
          </a>
          <p style="color:#6b7280;font-size:14px">Ce lien expire dans 1 heure. Si vous n'avez pas demand\u00e9 cette r\u00e9initialisation, ignorez cet email.</p>
        </div>`,
      });
    } else {
      this.logger.warn('Resend non configur\u00e9 (RESEND_API_KEY manquant). Token cr\u00e9\u00e9 sans envoi email.');
    }

    this.logger.log(`Demande de r\u00e9initialisation: ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date() || resetToken.used) {
      throw new BadRequestException({
        code: 'INVALID_RESET_TOKEN',
        message: 'Token de réinitialisation invalide ou expiré.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    this.logger.log(`Mot de passe réinitialisé: userId=${resetToken.userId}`);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    retryCount = 0,
  ): Promise<AuthTokens> {
    if (retryCount > 3) {
      throw new InternalServerErrorException({
        code: 'TOKEN_GENERATION_FAILED',
        message: 'Échec de génération des tokens après 3 tentatives.',
      });
    }

    const jti = uuidv4();
    const payload: JwtPayload = { sub: userId, email, role: role as any, jti };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '30d') as any,
      }),
    ]);

    // Stocker le refresh token en base
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // En cas de collision (extrêmement rare), on retente avec un nouveau jti
    try {
      await this.prisma.refreshToken.create({
        data: {
          userId,
          token: refreshToken,
          expiresAt,
        },
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Collision refreshToken: ${errMsg} — retry ${retryCount + 1}/3`);
      return this.generateTokens(userId, email, role, retryCount + 1);
    }

    return { accessToken, refreshToken };
  }
}
