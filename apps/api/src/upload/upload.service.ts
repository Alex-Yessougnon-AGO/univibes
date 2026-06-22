import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor() {
    // Configurer Cloudinary si les vars d'env sont présentes
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  private isConfigured(): boolean {
    return !!process.env.CLOUDINARY_CLOUD_NAME;
  }

  /**
   * Upload d'un fichier buffer vers Cloudinary.
   * @param file - Buffer du fichier + nom original
   * @param folder - Dossier Cloudinary (ex: "events", "profiles", "organizers")
   * @returns URL publique du fichier uploadé
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    folder: string = 'general',
  ): Promise<{ url: string; publicId: string }> {
    if (!this.isConfigured()) {
      throw new BadRequestException({
        code: 'CLOUDINARY_NOT_CONFIGURED',
        message:
          'Cloudinary n\'est pas configuré. Vérifiez les variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.',
      });
    }

    // Valider le type MIME via les premiers bytes (signature)
    const ext = originalName.split('.').pop()?.toLowerCase() ?? 'png';
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException({
        code: 'INVALID_FILE_TYPE',
        message: `Type de fichier non autorisé. Types acceptés : ${allowedExtensions.join(', ')}.`,
      });
    }

    // Vérifier la taille (max 10 MB)
    if (buffer.length > 10 * 1024 * 1024) {
      throw new BadRequestException({
        code: 'FILE_TOO_LARGE',
        message: 'Le fichier est trop volumineux. Taille maximum : 10 MB.',
      });
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `univibes/${folder}`,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Échec upload Cloudinary', error);
            reject(
              new BadRequestException({
                code: 'UPLOAD_FAILED',
                message: "Échec de l'upload vers Cloudinary.",
              }),
            );
            return;
          }

          this.logger.log(`Fichier uploadé: ${result.secure_url}`);
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      // Écrire le buffer dans le stream Cloudinary
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  /**
   * Supprimer un fichier de Cloudinary par son publicId.
   */
  async deleteFile(publicId: string): Promise<void> {
    if (!this.isConfigured()) return;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          this.logger.error(`Échec suppression Cloudinary: ${publicId}`, error);
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}
