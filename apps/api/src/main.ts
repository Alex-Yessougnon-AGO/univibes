import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, ApiResponseOptions } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SentryFilter } from './common/sentry/sentry.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DebugService } from './debug/debug.service';
import { SanitizePipe } from './common/pipes/sanitize.pipe';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Validation des secrets critiques — on ne démarre JAMAIS sans
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    logger.fatal('JWT_ACCESS_SECRET et JWT_REFRESH_SECRET sont requis.');
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    logger.fatal('DATABASE_URL est requis.');
    process.exit(1);
  }

  // Sentry
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV ?? 'development',
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1'),
      integrations: [],
    });
    logger.log('Sentry initialisé');
  }

  const app = await NestFactory.create(AppModule, {
    bufferLogs: process.env.NODE_ENV === 'production',
    // Raw body requis pour vérifier la signature HMAC du webhook FedaPay.
    rawBody: true,
  });

  // Helmet (security headers)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production'
          ? {
              directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: [
                  "'self'",
                  'data:',
                  'https://res.cloudinary.com',
                  'https://images.unsplash.com',
                ],
                connectSrc: [
                  "'self'",
                  process.env.FRONTEND_URL ?? 'http://localhost:3000',
                  'https://api.kkiapay.me',
                  'https://api.fedapay.com',
                ],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
                upgradeInsecureRequests: [],
              },
            }
          : false,
    }),
  );

  // CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL ?? 'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // XSS sanitization global — exécuté AVANT la validation
  app.useGlobalPipes(new SanitizePipe());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filters (Sentry must be first to catch all)
  app.useGlobalFilters(new SentryFilter(app.getHttpAdapter()));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response transform + logging/tracing
  const debugService = app.get(DebugService);
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(debugService),
  );

  // Swagger (dev only)
  if (process.env.NODE_ENV !== 'production') {
    debugService.setAppRef(app as any);

    const config = new DocumentBuilder()
      .setTitle('Univibes API')
      .setDescription(
        'API REST — Plateforme événementielle étudiante\n\n' +
          '## Authentification\n' +
          'Utiliser le bouton "Authorize" en haut à droite pour ajouter le token JWT.\n' +
          'Format : `Bearer <votre_token>`\n\n' +
          '## Codes erreur communs\n' +
          '- `400 BAD_REQUEST` — Validation échouée\n' +
          '- `401 UNAUTHORIZED` — Token manquant ou invalide\n' +
          '- `403 FORBIDDEN` — Droits insuffisants\n' +
          '- `404 NOT_FOUND` — Ressource introuvable\n' +
          '- `409 CONFLICT` — Conflit (email déjà utilisé, etc.)\n' +
          '- `429 RATE_LIMITED` — Trop de requêtes (100/min par IP)',
      )
      .setVersion('2.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addServer(
        process.env.APP_URL ?? 'http://localhost:3001',
        'Serveur local',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
      operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
    });
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  logger.log(`🚀 Univibes API  → http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger UI    → http://localhost:${port}/api/docs`);
}

bootstrap();
