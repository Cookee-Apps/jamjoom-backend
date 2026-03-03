import { OnEvent as ListenEvent } from '@nestjs/event-emitter';
import { IEventPayload } from './event-payloads.interface';

export const OnEvent = (eventName: keyof IEventPayload) =>
  ListenEvent(eventName, { async: true });
