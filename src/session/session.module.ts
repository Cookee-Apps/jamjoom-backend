import { Global, Module } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionRepository } from './repositories/session.repository';
import { DatabaseModule } from 'utils/db/db.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    SessionService,
    SessionRepository
  ],
  exports: [SessionService],
})
export class SessionModule {}
