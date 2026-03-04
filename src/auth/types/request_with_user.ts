import { Users, UserSession } from "@prisma/client";
import { IncomingMessage } from "node:http";

export class RequestWithUser extends IncomingMessage {
  user: Users;
  session: UserSession
}