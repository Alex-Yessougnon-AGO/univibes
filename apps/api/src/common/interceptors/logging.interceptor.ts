import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { DebugService } from '../../debug/debug.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly debugService?: DebugService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Ne pas logger en production (sauf si DEBUG_ENABLED)
    if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_ENABLED) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;

    // Request ID pour le tracing
    const requestId = uuidv4().substring(0, 8);
    (request as any).requestId = requestId;
    response.setHeader('X-Request-Id', requestId);

    const startTime = Date.now();
    const userInfo = request.user
      ? `user=${(request.user as any)?.id?.substring(0, 8)}`
      : 'anonymous';

    this.logger.log(`→ ${method} ${url} [${requestId}] ${userInfo}`);

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - startTime;
        const { statusCode } = response;
        this.logger.log(`← ${method} ${url} [${requestId}] ${statusCode} ${elapsed}ms`);

        // Ajouter au buffer de debug
        this.debugService?.addLog({
          timestamp: new Date().toISOString(),
          level: elapsed > 1000 ? 'warn' : 'log',
          message: `${method} ${url} → ${statusCode} (${elapsed}ms)`,
          context: 'HTTP',
          meta: { requestId, method, url, statusCode, elapsed, userId: (request.user as any)?.id },
        });
      }),
      catchError((err) => {
        const elapsed = Date.now() - startTime;
        const statusCode = err?.status || 500;

        this.logger.error(
          `✗ ${method} ${url} [${requestId}] ${statusCode} ${elapsed}ms - ${err.message}`,
          err.stack,
        );

        this.debugService?.addLog({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `${method} ${url} → ${statusCode} ${err.message}`,
          context: 'HTTP',
          trace: err.stack,
          meta: { requestId, method, url, statusCode, elapsed, error: err.message },
        });

        return throwError(() => err);
      }),
      finalize(() => {
        // On pourrait ajouter du cleanup ici si nécessaire
      }),
    );
  }
}
