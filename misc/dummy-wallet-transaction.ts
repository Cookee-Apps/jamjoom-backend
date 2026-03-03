// npx ts-node misc/dummy-wallet-transaction.ts

import { PrismaClient, TransactionType } from '@prisma/client';
import Redis from 'ioredis';
const prisma = new PrismaClient();

// Redis configuration
const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: Number(process.env.REDIS_PORT),
});

async function main() {
  console.log('🌱 Seeding wallet transactions...');

  const customerId = 'b65ad12a-92d4-4e98-bc34-bd88e9474a04';

  const walletTransactions = [
    {
      amount: 100,
      type: TransactionType.CREDIT,
      description: 'Dummy Wallet Transaction',
    },
    {
      amount: 100,
      type: TransactionType.DEBIT,
      description: 'Dummy Wallet Transaction',
    },
    {
      amount: 100,
      type: TransactionType.CREDIT,
      description: 'Dummy Wallet Transaction',
    },
    {
      amount: 100,
      type: TransactionType.DEBIT,
      description: 'Dummy Wallet Transaction',
    },
    {
      amount: 100,
      type: TransactionType.CREDIT,
      description: 'Dummy Wallet Transaction',
    },
    {
      amount: 100,
      type: TransactionType.CREDIT,
      description: 'Dummy Wallet Transaction',
    },
    {
      amount: 100,
      type: TransactionType.CREDIT,
      description: 'Dummy Wallet Transaction',
    },
  ];

  const customer = await prisma.users.findUnique({
    where: { id: customerId },
    include: {
      customer: {
        include: { wallet: true },
      },
    },
  });

  if (!customer) {
    throw new Error(`Customer with ID ${customerId} not found`);
  }
  if (!customer.customer) {
    throw new Error(`Customer with ID ${customerId} not found`);
  }
  if (!customer.customer.wallet) {
    throw new Error(`Wallet not found for customer with ID ${customerId}`);
  }

  const wallet = customer.customer.wallet;
  let totalAmount = 0;
  // Create wallet transactions
  // await prisma.walletTransaction.createMany({
  //   data: walletTransactions.map((transaction) => {
  //     if (transaction.type === TransactionType.CREDIT) {
  //       totalAmount += transaction.amount;
  //     } else {
  //       totalAmount -= transaction.amount;
  //     }
  //     return {
  //       ...transaction,
  //       walletId: wallet.id,
  //     };
  //   }),
  // });

  const Wallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: { balance: totalAmount + wallet.balance },
  });

  await redis.set(
    `wallet-customer-${wallet.customerId}`,
    JSON.stringify(Wallet),
  );

  console.log(`💸 Created ${walletTransactions.length} transactions`);
  console.log(`💰 Updated wallet balance to: ${Wallet.balance}`);
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
