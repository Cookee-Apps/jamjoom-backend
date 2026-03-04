import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import DateHelpers from 'utils/date.helper';
import { SessionRepository } from '../repositories/session.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async clearExpiredSessions() {
    const currentTime = DateHelpers.getCurrentDate();
    await this.sessionRepository.deleteSessions({
      expiresAt: { lte: currentTime },
    });
  }

  async findOne(sessionId: string) {
    return await this.sessionRepository.findSessionById(sessionId);
  }

  async findSessionsByAccount(accountId: string) {
    return await this.sessionRepository.findSessionsByAccountId(accountId);
  }

  async findSessionsByAccounts(accountIds: string[]) {
    return await this.sessionRepository.findSessions({ userId: { in: accountIds } });
  }

  async createSession(accountId: string, fbToken?: string) {
    const expiryDays = Number(
      this.configService
        .get<string>('JWT_REFRESH_TOKEN_EXPIRES')
        ?.split('d')[0],
    );
    const expiresAt = DateHelpers.addDaysToDate(expiryDays);
    const createdSession = await this.sessionRepository.createSession(
      accountId,
      expiresAt,
      fbToken
    );
    return createdSession.id;
  }

  async deleteSession(sessionId: string): Promise<void> {
    return await this.sessionRepository.deleteSession(sessionId);
  }

  async deleteAllUserSessions(accountId: string): Promise<void> {
    return await this.sessionRepository.deleteSessions({ userId: accountId });
  }

  async validateRefreshToken(tokenId: string) {
    const refreshToken = await this.sessionRepository.findRefreshToken(tokenId);
    return refreshToken;
  }

  async updateRefreshToken(
    id: string,
    data: Prisma.SessionRefreshTokensUpdateInput,
  ) {
    return await this.sessionRepository.updateRefreshToken(id, data);
  }

  async deleteRefreshToken(id: string){
    return await this.sessionRepository.deleteRefreshToken(id)
  }

  async createRefreshToken(sessionId: string, expiresAt: Date) {
    return await this.sessionRepository.createRefreshToken(
      sessionId,
      expiresAt,
    );
  }
}
