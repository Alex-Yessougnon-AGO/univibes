import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketsGateway } from './websockets.gateway';

/**
 * Module global WebSocket (Socket.io).
 * Le gateway est exporté pour que NotificationsService puisse emitToUser().
 */
@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
    }),
  ],
  providers: [WebsocketsGateway],
  exports: [WebsocketsGateway],
})
export class WebsocketsModule {}
