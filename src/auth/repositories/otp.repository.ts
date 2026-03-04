import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CacheService } from 'utils/cache/cache.service';
import dateHelper from 'utils/date.helper';
import DatabaseService from 'utils/db/db.service';

@Injectable()
export class OTPRepository {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly cache: CacheService,
  ) { }

  async findOne(where: Prisma.UserOTPsWhereInput, db: Prisma.TransactionClient = this.dbService) {
    if (where.phoneNumber && where.otp) {
      let otpValue = (await this.cache.get(
        `${where.phoneNumber}-otp`,
      )) as string;
      if (otpValue) {
        const [id, otp, expiresAt] = otpValue.split(':');
        if (otp === where.otp)
          return { id, otp, expiresAt: new Date(Number(expiresAt)) };
      }
    }
    return await db.userOTPs.findFirst({
      where,
    });
  }

  async delete(where: Prisma.UserOTPsWhereUniqueInput) {
    const deletedOTP = await this.dbService.userOTPs.delete({
      where,
    });
    this.cache.del(`${deletedOTP.phoneNumber}-otp`);
    return deletedOTP;
  }

  async deleteMany(where: Prisma.UserOTPsWhereInput, db: Prisma.TransactionClient = this.dbService) {
    return await db.userOTPs.deleteMany({ where });
  }

  async create(data: Prisma.UserOTPsCreateInput, db: Prisma.TransactionClient = this.dbService) {
    const created = await db.userOTPs.create({
      data,
    });
    const ttl = dateHelper.diffInMilliSeconds(
      dateHelper.getCurrentDate(),
      created.expiresAt as Date,
    );
    this.cache.set(
      `${created.phoneNumber}-otp`,
      `${created.id}:${created.otp}:${created.expiresAt.getTime()}`,
      Math.floor(ttl / 1000),
    );
    return created;
  }
}
