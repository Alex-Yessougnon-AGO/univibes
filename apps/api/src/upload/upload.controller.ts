import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/interfaces/auth.types';

@ApiTags('upload')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowed.includes(file.mimetype)) {
          cb(
            new BadRequestException({
              code: 'INVALID_FILE_TYPE',
              message: 'Type de fichier non autorisé. Types acceptés : JPEG, PNG, GIF, WebP, SVG.',
            }),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Uploader un fichier',
    description: "Upload d'une image vers Cloudinary. Retourne l'URL publique. Utilisez le form-data avec le champ 'file'.",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier image (JPEG, PNG, GIF, WebP, SVG) max 10 MB',
        },
        folder: {
          type: 'string',
          description: 'Dossier de destination (events, profiles, organizers, general)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fichier uploadé avec succès' })
  @ApiResponse({ status: 400, description: 'Fichier invalide' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() _user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException({
        code: 'NO_FILE',
        message: 'Aucun fichier fourni.',
      });
    }

    const result = await this.uploadService.uploadFile(
      file.buffer,
      file.originalname,
      'general',
    );

    return {
      url: result.url,
      publicId: result.publicId,
    };
  }

  @Post('profile')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.mimetype)) {
          cb(
            new BadRequestException({
              code: 'INVALID_FILE_TYPE',
              message: 'Type de fichier non autorisé pour la photo de profil.',
            }),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({
    summary: 'Uploader une photo de profil',
    description: "Upload d'une photo de profil vers Cloudinary. Taille max 5 MB.",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Photo de profil uploadée' })
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException({
        code: 'NO_FILE',
        message: 'Aucun fichier fourni.',
      });
    }

    const result = await this.uploadService.uploadFile(
      file.buffer,
      file.originalname,
      'profiles',
    );

    return {
      url: result.url,
      publicId: result.publicId,
      message: 'Photo de profil uploadée. Utilisez PATCH /users/profile pour l\'associer à votre profil.',
    };
  }
}
