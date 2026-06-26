import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as crypto from 'crypto';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PaymentsService } from '../src/payments/payments.service';
import { CheckinService } from '../src/checkin/checkin.service';
import { FedaPayService } from '../src/payments/fedapay.service';

/**
 * E2E — Flux critique Paiement → Billets → Check-in + idempotence.
 *
 * Ces tests nécessitent une base de données PostgreSQL accessible
 * (DATABASE_URL). Ils valident le chemin métier le plus important de la
 * plateforme : un paiement confirmé génère des billets, et un billet peut
 * être validé une seule fois au check-in.
 *
 * Saute automatiquement si la DB n'est pas joignable.
 */
describe('Payment → Tickets → Checkin flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let paymentsService: PaymentsService;
  let checkinService: CheckinService;
  let fedapayService: FedaPayService;
  let dbAvailable = false;

  // Fixtures partagées
  let studentId: string;
  let orderId: string;
  let paymentId: string;
  const FEDA_SECRET = 'test-webhook-secret';
  const providerRef = `test_ref_${Date.now()}`;

  beforeAll(async () => {
    process.env.FEDAPAY_WEBHOOK_SECRET = FEDA_SECRET;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    paymentsService = app.get(PaymentsService);
    checkinService = app.get(CheckinService);
    fedapayService = app.get(FedaPayService);

    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      dbAvailable = false;
    }
  }, 60000);

  afterAll(async () => {
    if (dbAvailable && orderId) {
      await prisma.issuedTicket.deleteMany({ where: { orderId } }).catch(() => undefined);
      await prisma.payment.deleteMany({ where: { orderId } }).catch(() => undefined);
      await prisma.orderItem.deleteMany({ where: { orderId } }).catch(() => undefined);
      await prisma.order.deleteMany({ where: { id: orderId } }).catch(() => undefined);
      if (studentId) {
        await prisma.notification.deleteMany({ where: { userId: studentId } }).catch(() => undefined);
        await prisma.user.deleteMany({ where: { id: studentId } }).catch(() => undefined);
      }
    }
    await app.close();
  }, 60000);

  (dbAvailable ? describe : describe.skip)('avec base de données', () => {
    it('crée les fixtures (user, event, ticket, order)', async () => {
      // Student
      const user = await prisma.user.create({
        data: {
          email: `e2eflow-${Date.now()}@test.com`,
          password: '$2b$10$hashedplaceholder',
          profile: { create: { fullname: 'E2E Flow Student' } },
        },
        include: { profile: true },
      });
      studentId = user.id;

      // Organizer + Event + Ticket
      const organizer = await prisma.organizer.create({
        data: { userId: user.id, organizationName: 'E2E Org' },
      });
      const event = await prisma.event.create({
        data: {
          organizerId: organizer.id,
          title: 'E2E Test Event',
          slug: `e2e-${Date.now()}`,
          description: 'desc',
          location: 'Cotonou',
          city: 'Cotonou',
          startDate: new Date(Date.now() + 86400000),
          endDate: new Date(Date.now() + 2 * 86400000),
        },
      });
      const ticket = await prisma.ticket.create({
        data: {
          eventId: event.id,
          name: 'Standard',
          price: 5000,
          quantity: 100,
          remaining: 100,
        },
      });

      // Order + 2 billets
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          eventId: event.id,
          amount: 10000,
          status: 'pending',
          items: {
            create: { ticketId: ticket.id, quantity: 2, unitPrice: 5000 },
          },
        },
        include: { items: true },
      });
      orderId = order.id;

      // Payment pending
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'fedapay',
          providerReference: providerRef,
          amount: 10000,
          status: 'pending',
        },
      });
      paymentId = payment.id;

      expect(orderId).toBeDefined();
      expect(paymentId).toBeDefined();
    });

    it('le webhook de paiement confirmé génère les billets', async () => {
      await paymentsService.handleWebhook({
        provider: 'fedapay',
        providerReference: providerRef,
        status: 'success',
      });

      const tickets = await prisma.issuedTicket.findMany({ where: { orderId } });
      expect(tickets.length).toBe(2);

      // La commande doit être passée en "paid"
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      expect(order?.status).toBe('paid');

      // Une notification "payment_success" doit être créée
      const notifs = await prisma.notification.findMany({
        where: { userId: studentId, type: 'payment_success' },
      });
      expect(notifs.length).toBe(1);
    });

    it('un second webhook est idempotent (pas de billets en double)', async () => {
      await paymentsService.handleWebhook({
        provider: 'fedapay',
        providerReference: providerRef,
        status: 'success',
      });

      const tickets = await prisma.issuedTicket.findMany({ where: { orderId } });
      expect(tickets.length).toBe(2); // toujours 2, pas 4

      const notifs = await prisma.notification.findMany({
        where: { userId: studentId, type: 'payment_success' },
      });
      expect(notifs.length).toBe(1); // toujours 1 notification
    });

    it('vérifie le QR code d\'un billet émis', async () => {
      const [ticket] = await prisma.issuedTicket.findMany({ where: { orderId } });

      const result = await checkinService.verify(ticket.qrCode);
      expect(result.valid).toBe(true);
      expect(result.used).toBe(false);
      expect(result.attendee.eventName).toBe('E2E Test Event');
    });

    it('effectue le check-in du premier billet', async () => {
      const [ticket] = await prisma.issuedTicket.findMany({ where: { orderId } });

      const result = await checkinService.verifyAndCheckin(ticket.qrCode);
      expect(result.success).toBe(true);
      expect(result.checkedInAt).toBeDefined();
    });

    it('refuse un second check-in sur le même billet (ALREADY_CHECKED_IN)', async () => {
      const [ticket] = await prisma.issuedTicket.findMany({ where: { orderId } });

      await expect(checkinService.verifyAndCheckin(ticket.qrCode)).rejects.toMatchObject({
        response: { code: 'ALREADY_CHECKED_IN' },
      });
    });

    it('le second billet peut encore être check-in', async () => {
      const [, ticket2] = await prisma.issuedTicket.findMany({ where: { orderId } });

      const result = await checkinService.verifyAndCheckin(ticket2.qrCode);
      expect(result.success).toBe(true);
    });

    it('rejette un QR code inconnu au check-in', async () => {
      await expect(checkinService.verify('unknown-qr')).rejects.toMatchObject({
        response: { code: 'INVALID_QR_CODE' },
      });
    });
  });

  describe('Vérification signature webhook FedaPay', () => {
    it('accepte un webhook avec une signature HMAC valide', async () => {
      const body = JSON.stringify({
        provider: 'fedapay',
        providerReference: 'valid_' + Date.now(),
        status: 'success',
      });
      const signature = crypto
        .createHmac('sha256', FEDA_SECRET)
        .update(body)
        .digest('hex');

      const valid = await fedapayService.verifyWebhook(signature, body);
      expect(valid).toBe(true);
    });

    it('rejette un webhook avec une signature invalide', async () => {
      const body = JSON.stringify({ status: 'success' });
      const valid = await fedapayService.verifyWebhook('invalid-signature', body);
      expect(valid).toBe(false);
    });

    it('rejette un webhook quand FEDAPAY_WEBHOOK_SECRET est absent (prod-safe)', async () => {
      const saved = process.env.FEDAPAY_WEBHOOK_SECRET;
      delete process.env.FEDAPAY_WEBHOOK_SECRET;
      const valid = await fedapayService.verifyWebhook('any', '{}');
      expect(valid).toBe(false);
      process.env.FEDAPAY_WEBHOOK_SECRET = saved;
    });
  });

  describe('HTTP — signature invalide = 401', () => {
    it('POST /api/v1/payments/webhook renvoie 401 sans signature valide', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/payments/webhook')
        .set('x-fedapay-signature', 'invalid')
        .send({ provider: 'fedapay', providerReference: 'x', status: 'success' });
      expect(res.status).toBe(401);
    });
  });
});
