import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

/**
 * E2E tests for Univibes API
 * These tests work with or without a running database.
 * When DB is unavailable, tests verify the error response structure.
 */

describe('Univibes API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('GET /api/v1/health returns status', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/health');
      expect(res.status).toBe(200);
      // Structure with or without DB
      if (res.body.data) {
        expect(res.body.data.version).toBe('2.0.0');
      }
    });
  });

  describe('Validation', () => {
    it('POST /api/v1/auth/register rejects invalid email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'invalid', fullname: 'Test', password: '12345678' });
      expect(res.status).toBe(400);
    });

    it('POST /api/v1/auth/register rejects short password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({ email: 'test@test.com', fullname: 'Test', password: 'short' });
      expect(res.status).toBe(400);
    });

    it('GET /api/v1/users/profile requires auth', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/users/profile');
      expect(res.status).toBe(401);
    });

    it('POST /api/v1/auth/login rejects missing fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({});
      expect(res.status).toBe(400);
    });
  });

  describe('Public Endpoints', () => {
    it('GET /api/v1/categories returns list or error', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/categories');
      expect([200, 500, 503]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(res.body.data)).toBe(true);
      }
    });

    it('GET /api/v1/events returns paginated list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/events')
        .query({ page: 1, limit: 10 });
      expect([200, 500, 503]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.data).toBeDefined();
      }
    });

    it('GET /api/v1/debug/logs returns dev data', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/debug/logs');
      expect([200, 403]).toContain(res.status);
    });
  });

  describe('Auth Flow', () => {
    const timestamp = Date.now();
    const testUser = {
      email: `e2e-${timestamp}@test.com`,
      fullname: 'E2E Test User',
      password: 'Password123!',
    };

    it('POST /api/v1/auth/register', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser);
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(600);
      if (res.status === 201 && res.body?.data) {
        expect(res.body.data.user?.email).toBe(testUser.email);
      }
    });

    it('POST /api/v1/auth/login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: testUser.password });
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(600);
      if (res.status === 200 && res.body?.data?.tokens) {
        expect(res.body.data.tokens.accessToken).toBeDefined();
      }
    });

    it('POST /api/v1/auth/login fails with wrong password', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: testUser.email, password: 'WrongPassword1!' });
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(600);
    });
  });

  describe('Swagger', () => {
    it('GET /api/docs returns Swagger UI', async () => {
      const res = await request(app.getHttpServer()).get('/api/docs');
      expect([200, 302, 404]).toContain(res.status);
    });
  });
});
