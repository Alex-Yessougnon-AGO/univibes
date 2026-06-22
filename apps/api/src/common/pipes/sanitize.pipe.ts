import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

/**
 * Supprime les balises HTML d'une chaîne via regex.
 * Alternative légère et sans dépendance à `striptags`.
 */
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Récursivement supprime les balises HTML de toutes les chaînes de caractères
 * afin de prévenir les attaques XSS (Cross-Site Scripting).
 *
 * S'applique automatiquement à chaque requête entrante via un global pipe,
 * AVANT la validation.
 */
@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    if (typeof value === 'string') {
      return stripHtml(value).trim();
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item, _metadata));
    }
    if (typeof value === 'object' && value !== null) {
      // Ignorer les types spéciaux (Date, Buffer, File, Blob)
      if (
        value instanceof Date ||
        value instanceof Buffer ||
        value instanceof Blob
      ) {
        return value;
      }
      const sanitized: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.transform(val, _metadata);
      }
      return sanitized;
    }
    return value;
  }
}
