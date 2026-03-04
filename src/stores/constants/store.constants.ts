import { Prisma } from '@prisma/client';

export const selectFields: Prisma.StoreSelect = {
  id: true,
  name: true,
  address: true,
  serviceRadius: true,
  contactNumber: true,
  createdAt: true,
  latitude: true,
  longitude: true,
  placeName: true,
  notificationContactNumber: true,
  locationEmbedLink: true,
  user: {
    select: { phoneNumber: true, active: true },
  }
};

export const error_messages = {
  storeNotFound: 'Store not found',
  storeBlocked: 'Store is blocked',
};
