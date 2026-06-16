import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../common/audit/audit.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        organizer: true,
        _count: { select: { favorites: true, orders: true } },
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      profile: user.profile,
      organizer: user.organizer,
      stats: {
        favoritesCount: user._count.favorites,
        ordersCount: user._count.orders,
      },
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        fullname: dto.fullname,
        phone: dto.phone,
        city: dto.city,
        university: dto.university,
        faculty: dto.faculty,
        avatarUrl: dto.avatarUrl,
      },
    });

    this.logger.log(`Profile mis à jour: ${userId}`);
    await this.audit.log({
      actorId: userId,
      action: 'PROFILE_UPDATED',
      entityType: 'profile',
      entityId: updated.id,
    });

    return updated;
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    this.logger.log(`Compte supprimé: ${userId}`);
    await this.audit.log({
      actorId: userId,
      action: 'ACCOUNT_DELETED',
      entityType: 'user',
      entityId: userId,
    });
  }
}
