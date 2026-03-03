import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IEventPayload } from './event-payloads.interface';

@Injectable()
export class EventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends keyof IEventPayload>(
    event: K,
    payload: IEventPayload[K],
  ): boolean {
    return this.eventEmitter.emit(event, payload);
  }
}
