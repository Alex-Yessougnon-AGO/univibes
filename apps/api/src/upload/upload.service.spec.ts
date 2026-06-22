import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PassThrough } from 'stream';
import { UploadService } from './upload.service';

// Mock centralisé pour cloudinary
// On déclare les mocks DANS la factory pour éviter le hoisting ReferenceError
jest.mock('cloudinary', () => {
  const mockUploadStream = jest.fn();
  const mockDestroy = jest.fn();
  return {
    v2: {
      config: jest.fn(),
      uploader: {
        upload_stream: mockUploadStream,
        destroy: mockDestroy,
      },
    },
  };
});

// Récupération des mocks après import
import { v2 as cloudinary } from 'cloudinary';

// Cast pour accéder aux mocks dans les tests
const cloudinaryUploader = cloudinary.uploader as jest.Mocked<typeof cloudinary.uploader>;

describe('UploadService', () => {
  let service: UploadService;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
    process.env.CLOUDINARY_API_KEY = 'test-key';
    process.env.CLOUDINARY_API_SECRET = 'test-secret';

    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should reject if Cloudinary is not configured', async () => {
      delete process.env.CLOUDINARY_CLOUD_NAME;
      const svc = new UploadService();

      await expect(
        svc.uploadFile(Buffer.from('test'), 'test.png'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject invalid file extensions', async () => {
      await expect(
        service.uploadFile(Buffer.from('test'), 'test.exe'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject files larger than 10 MB', async () => {
      const largeBuffer = Buffer.alloc(11 * 1024 * 1024);
      await expect(
        service.uploadFile(largeBuffer, 'test.png'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept valid image files and return Cloudinary URL', async () => {
      const mockUploadStream = cloudinaryUploader.upload_stream as jest.Mock;
      mockUploadStream.mockImplementation((_opts: any, callback: any) => {
        const stream = new PassThrough();
        process.nextTick(() => {
          callback(null, {
            secure_url: 'https://res.cloudinary.com/test/image/upload/v1/test.png',
            public_id: 'univibes/general/test',
          });
        });
        return stream;
      });

      const result = await service.uploadFile(Buffer.from('fake-image'), 'test.png');
      expect(result.url).toBe('https://res.cloudinary.com/test/image/upload/v1/test.png');
      expect(result.publicId).toBe('univibes/general/test');
    });

    it('should reject with UPLOAD_FAILED when Cloudinary returns error', async () => {
      const mockUploadStream = cloudinaryUploader.upload_stream as jest.Mock;
      mockUploadStream.mockImplementation((_opts: any, callback: any) => {
        const stream = new PassThrough();
        process.nextTick(() => callback(new Error('Upload failed'), null));
        return stream;
      });

      await expect(
        service.uploadFile(Buffer.from('test'), 'test.png'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept all allowed extensions', async () => {
      const mockUploadStream = cloudinaryUploader.upload_stream as jest.Mock;
      mockUploadStream.mockImplementation((_opts: any, callback: any) => {
        const stream = new PassThrough();
        process.nextTick(() => callback(null, { secure_url: 'https://ex.com/i', public_id: 'i' }));
        return stream;
      });

      for (const ext of ['jpg', 'jpeg', 'gif', 'webp', 'svg']) {
        const result = await service.uploadFile(Buffer.from('test'), `test.${ext}`);
        expect(result.url).toBeTruthy();
      }
    });
  });

  describe('deleteFile', () => {
    it('should resolve when Cloudinary delete succeeds', async () => {
      const mockDestroy = cloudinaryUploader.destroy as jest.Mock;
      mockDestroy.mockImplementation((_id: any, callback: any) => {
        callback(null);
      });
      await expect(service.deleteFile('test-id')).resolves.toBeUndefined();
    });

    it('should reject when Cloudinary delete fails', async () => {
      const mockDestroy = cloudinaryUploader.destroy as jest.Mock;
      mockDestroy.mockImplementation((_id: any, callback: any) => {
        callback(new Error('Delete failed'));
      });
      await expect(service.deleteFile('test-id')).rejects.toThrow();
    });

    it('should silently succeed when Cloudinary is not configured', async () => {
      delete process.env.CLOUDINARY_CLOUD_NAME;
      const svc = new UploadService();
      await expect(svc.deleteFile('test-id')).resolves.toBeUndefined();
    });
  });
});
