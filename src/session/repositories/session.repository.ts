import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, SessionRefreshTokens, UserSession } from '@prisma/client';
import { CacheService } from 'utils/cache/cache.service';
import DatabaseService from 'utils/db/db.service';
import { Logger } from 'utils/logger/logger.service';

@Injectable()
export class SessionRepository {
  constructor(
    private db: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly logger: Logger,
  ) {}

  async findSessionById(sessionId: string) {
    const cacheEntry = await this.cacheService.get(`session-${sessionId}`);
    if (cacheEntry) return cacheEntry as UserSession;
    const session = await this.db.userSession.findFirst({
      where: { id: sessionId },
    });
    if (session) {
      const ttl = Math.max(
        0,
        Math.floor((session.expiresAt.getTime() - Date.now()) / 1000),
      );
      this.cacheService.set(`session-${session.id}`, session, ttl);
    }
    return session;
  }
  async findSessionsByAccountId(accountId: string) {
    return await this.db.userSession.findMany({
      where: { userId: accountId },
    });
  }

  async findSessions(where: Prisma.UserSessionWhereInput) {
    return await this.db.userSession.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }

  async createSession(userId: string, expiresAt: Date, fbToken: string = '') {
    this.cleanupOldSessions(userId);
    let sessionsWithFBToken: UserSession[] = [];
    if (fbToken && fbToken !== '')
      sessionsWithFBToken = await this.db.userSession.findMany({
        where: { firebaseToken: fbToken },
      });
    if (sessionsWithFBToken.length > 0) await this.db.userSession.deleteMany({ where: { id: { in: sessionsWithFBToken.map((each) => each.id) } } })
    const createdSession = await this.db.userSession.create({
      data: {
        userId,
        expiresAt,
        firebaseToken: fbToken
      },
    });
    const ttl = Math.max(
      0,
      Math.floor((expiresAt.getDay() - Date.now()) / 1000),
    );
    this.cacheService.set(`session-${createdSession.id}`, createdSession, ttl);
    return createdSession;
  }

  private async cleanupOldSessions(userId: string): Promise<void> {
    try {
      const oldestSession = await this.db.userSession.findFirst({
        skip: 4,
        orderBy: { createdAt: 'desc' },
        where: { userId },
      });

      if (oldestSession) {
        this.db.userSession.delete({ where: { id: oldestSession.id } });
        this.cacheService.del(`session-${oldestSession.id}`);
      }
    } catch (err) {
      this.logger.error('Error cleaning up old sessions:', err);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.cacheService.del(`session-${sessionId}`)
    const session = await this.db.userSession.delete({ where: { id: sessionId }, include: { refreshTokens: true } });
    if (session.refreshTokens.length > 0) {
      const ids = session.refreshTokens.map((each) => each.id)
      ids.forEach((id) => this.cacheService.deleteByPrefix(`refresh-token-${id}`))
    }
    return;
  }

  async deleteSessions(where: Prisma.UserSessionWhereInput): Promise<void> {
    await this.db.userSession.deleteMany({ where });
    return;
  }

  async findRefreshToken(id: string) {
    let cacheEntry = await this.cacheService.get(`refresh-token-${id}`) as SessionRefreshTokens
    if (cacheEntry) return cacheEntry;
    const entry = await this.db.sessionRefreshTokens.findFirst({
      where: { id },
    });
    if (entry) this.cacheService.set(`refresh-token-${entry.id}`, entry);
    return entry;
  }

  async updateRefreshToken(
    id: string,
    data: Prisma.SessionRefreshTokensUpdateInput,
  ) {
    const updated = await this.db.sessionRefreshTokens.update({
      where: { id },
      data,
    });
    this.cacheService.set(`refresh-token-${updated.id}`, updated)
    return updated
  }

  async getRefreshTokenForSession(sessionId: string) {
    return await this.db.sessionRefreshTokens.findMany({
      where: { sessionId },
    });
  }

  async deleteRefreshToken(id: string) {
    try {
      this.cacheService.del(`refresh-token-${id}`)
      return await this.db.sessionRefreshTokens.delete({ where: { id } })
    } catch (error) {
      throw new BadRequestException("Something Went Wrong")
    }
  }

  async createRefreshToken(sessionId: string, expiresAt: Date) {
    const refreshToken = await this.db.sessionRefreshTokens.create({
      data: {
        sessionId,
        expiresAt,
      },
    });
    this.cacheService.set(`refresh-token-${refreshToken.id}`, refreshToken);
    return refreshToken;
  }
}
