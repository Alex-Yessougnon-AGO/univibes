import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { AuditModule } from './common/audit/audit.module';
import { HealthController } from './health/health.controller';

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

    // Modules métier (décommentés au fur et à mesure)
    // AuthModule,
    // UsersModule,
    // OrganizersModule,
    // EventsModule,
    // CategoriesModule,
    // FavoritesModule,
    // TicketsModule,
    // OrdersModule,
    // PaymentsModule,
    // NotificationsModule,
    // BoostsModule,
    // AdsModule,
    // AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
