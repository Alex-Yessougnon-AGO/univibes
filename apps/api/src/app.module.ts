import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuditModule } from './common/audit/audit.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/strategies/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { OrganizersModule } from './organizers/organizers.module';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TicketsModule } from './tickets/tickets.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BoostsModule } from './boosts/boosts.module';
import { AdsModule } from './ads/ads.module';
import { AdminModule } from './admin/admin.module';
import { DebugModule } from './debug/debug.module';
import { CheckinModule } from './checkin/checkin.module';
import { UploadModule } from './upload/upload.module';
import { CacheModule } from './cache/cache.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting : 100 req / minute par IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Base de données
    PrismaModule,

    // Observabilité
    LoggerModule,
    AuditModule,

    // Modules métier
    AuthModule,
    UsersModule,
    OrganizersModule,
    EventsModule,
    CategoriesModule,
    FavoritesModule,
    TicketsModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    BoostsModule,
    AdsModule,
    AdminModule,

    // Cache Redis
    CacheModule,

    // Debug (dev only)
    DebugModule,
    CheckinModule,
    UploadModule,

    // Temps réel (notifications WebSocket)
    WebsocketsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
