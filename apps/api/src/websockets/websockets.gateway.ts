import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class WebsocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebsocketsGateway.name);

  /** Map userId → socket.id (un utilisateur peut avoir plusieurs sockets) */
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.debug(`Socket ${client.id} refusé — pas de token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub as string;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      client.data.userId = userId;

      this.logger.log(`Socket connecté: ${client.id} → user ${userId}`);
    } catch {
      this.logger.debug(`Socket ${client.id} refusé — token invalide`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId as string | undefined;
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    this.logger.debug(`Socket déconnecté: ${client.id}`);
  }

  /**
   * Envoyer une notification en temps réel à un utilisateur spécifique.
   * Typiquement appelé par NotificationsService après une création.
   */
  emitToUser(userId: string, event: string, payload: unknown) {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      return;
    }
    for (const socketId of sockets) {
      this.server.to(socketId).emit(event, payload);
    }
  }
}
