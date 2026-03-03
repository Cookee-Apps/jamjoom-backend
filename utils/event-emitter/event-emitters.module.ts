import { Global, Module } from '@nestjs/common';
import { EventEmitter } from './typed-event-emitters';
import { EventEmitterModule as RootEventModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [RootEventModule.forRoot()],
  providers: [EventEmitter],
  exports: [EventEmitter],
})
export class EventEmitterModule {}
