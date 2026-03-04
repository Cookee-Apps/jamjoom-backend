import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StoreRepository } from '../repositories/stores.repository';
import {
  AddressIdDto,
  CheckStoreIsServiceableDto,
  CreateStoreDto,
  DeleteStoreDto,
  GetAllStoresParamsDto,
  ToggleStoreDto,
  UpdateStoreDto,
} from '../dto/stores.dto';
import { RoleService } from 'src/roles/services/role.service';
import { Prisma } from '@prisma/client';
import DatabaseService from 'utils/db/db.service';
import { selectFields } from '../constants/store.constants';
import { StoreValidator } from '../validatiors/store.validators';
import { ConfigKey } from 'src/configuration/interfaces/configuration.dto.interface';
import DateHelpers from 'utils/date.helper';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepo: StoreRepository,
    private readonly roleService: RoleService,
    private readonly dbService: DatabaseService,
    private readonly storeValidator: StoreValidator
  ) {}

  async createStore(params: CreateStoreDto) {
    const roleDetails = await this.roleService.getRoleByName('STORE_MANAGER');
    if (!roleDetails) throw new InternalServerErrorException();
    await this.storeValidator.isExistingNumber(params.phoneNumber);
    return this.dbService.$transaction(async (tx) => {
      const newStore = await this.storeRepo.insert(
        {
          name: params.name,
          user: {
            create: {
              phoneNumber: params.phoneNumber,
              role: { connect: { id: roleDetails.id } },
            },
          },
          serviceRadius: params.serviceRadius,
          placeName: params.placeName ? params.placeName : '',
          notificationContactNumber: params.whatsappNotificationNumber || '',
          address: params.address,
          latitude: params.latitude,
          longitude: params.longitude,
          contactNumber: params.contactNumber,
          locationEmbedLink: params.locationEmbedLink,
        },
        tx,
      );
      return { id: newStore.id };
    });
  }

  async updateStore(params: UpdateStoreDto) {

    const updateData: Prisma.StoreUpdateInput = {};

    if (params.phoneNumber !== undefined) {
      updateData.user = { update: { phoneNumber: params.phoneNumber } };
    }
    if (params.address !== undefined) {
      updateData.address = params.address;
    }
    if (params.latitude !== undefined) {
      updateData.latitude = params.latitude;
    }
    if (params.longitude !== undefined) {
      updateData.longitude = params.longitude;
    }
    if (params.serviceRadius !== undefined) {
      updateData.serviceRadius = params.serviceRadius;
    }
    if (params.contactNumber !== undefined) {
      updateData.contactNumber = params.contactNumber;
    }
    if (params.name !== undefined) {
      updateData.name = params.name;
    }

    if (params.placeName !== undefined) {
      updateData.placeName = params.placeName;
    }

    if (params.locationEmbedLink !== undefined) {
      updateData.locationEmbedLink = params.locationEmbedLink;
    }

    return await this.dbService.$transaction(async (tx) => {
      await this.storeRepo.update(params.id, updateData, tx);
      return { updated: true };
    });
  }

  async toggleStore(params: ToggleStoreDto) {
    const store = await this.findStoreById(params.id);
    return await this.storeRepo.update(params.id, {
      user: { update: { active: !store?.user.active } },
    });
  }

  async findStoreById(id: string) {
    return await this.storeRepo.findOne({ id });
  }

  async findStoreByUserId(userId: string) {
    return await this.storeRepo.findOne({ userId });
  }

  async deleteStore(params: DeleteStoreDto) {
    await this.storeRepo.delete(params.id);
    return { deleted: true };
  }

  async count(where: Prisma.StoreWhereInput) {
    return await this.storeRepo.count(where);
  }

  async topStoresByRevenue(limit: number, fromDate?: Date, toDate?: Date) {
    let dateFilter = Prisma.sql``;
    if (fromDate) fromDate = DateHelpers.startOfDay(fromDate);
    if (toDate) toDate = DateHelpers.endOfDay(toDate);

    if (fromDate && toDate) {
      dateFilter = Prisma.sql`AND o."createdAt" >= ${fromDate} AND o."createdAt" <= ${toDate}`;
    } else if (fromDate) {
      dateFilter = Prisma.sql`AND o."createdAt" >= ${fromDate}`;
    } else if (toDate) {
      dateFilter = Prisma.sql`AND o."createdAt" <= ${toDate}`;
    }

    return this.storeRepo.runParameterizedQuery<{
      id: string;
      name: string;
      totalRevenue: string;
    }>(Prisma.sql`
    SELECT 
      s.id,
      s.name,
      COALESCE(SUM(o."totalAmount"), 0) AS "totalRevenue"
    FROM "Store" s
    LEFT JOIN "Order" o ON o."storeId" = s.id
    WHERE 1=1 ${dateFilter}
    GROUP BY s.id
    ORDER BY "totalRevenue" DESC
    LIMIT ${Number(limit)}
  `);
  }

  async getAllStores(params: GetAllStoresParamsDto) {
    const where: Prisma.StoreWhereInput = { deletedAt: null };
    if (params.searchText) {
      where.name = { contains: params.searchText, mode: 'insensitive' };
    }
    if (params.from && params.to) {
      where.createdAt = {
        gte: DateHelpers.startOfDay(params.from),
        lte: DateHelpers.endOfDay(params.to),
      };
    }
    const [stores, totalCount] = await Promise.all([
      this.findAll(where, selectFields, params.limit, params.skip),
      this.storeRepo.count(where),
    ]);
    return { stores, totalCount };
  }

  // Haversine formula
  toRad = (value: number) => (value * Math.PI) / 180;

  getDistanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  checkServiceableStore = async (params: AddressIdDto) => {
    this.storeValidator.validateParams(params);

    // Convert input to numbers
    let latitude = Number(params.latitude ?? 0);
    let longitude = Number(params.longitude ?? 0);

    // If addressId is provided, get coordinates from DB
    if (params.addressId) {
      latitude = 0.0
      longitude = 0.0
    }

    // Fetch all stores (or optionally use a wider bounding box to optimize)
    const stores = await this.storeRepo.find({});

    // Filter stores within service radius
    const serviceableStores = stores.filter((store) => {
      const distance = this.getDistanceInKm(
        latitude,
        longitude,
        Number(store.latitude),
        Number(store.longitude),
      );
      return distance <= store.serviceRadius;
    });

    // If none, return null
    if (serviceableStores.length === 0) return { store: null };

    // Find nearest among serviceable stores
    let nearestStore = serviceableStores[0];
    let minDistance = this.getDistanceInKm(
      latitude,
      longitude,
      Number(nearestStore.latitude),
      Number(nearestStore.longitude),
    );

    for (const store of serviceableStores) {
      const distance = this.getDistanceInKm(
        latitude,
        longitude,
        Number(store.latitude),
        Number(store.longitude),
      );
      if (distance < minDistance) {
        nearestStore = store;
        minDistance = distance;
      }
    }

    return { store: nearestStore, distanceInKm: minDistance };
  };

  async findAll(
    where: Prisma.StoreWhereInput,
    select?: Prisma.StoreSelect,
    limit?: number,
    skip?: number,
  ) {
    return await this.dbService.store.findMany({
      where,
      select,
      take: limit,
      skip,
    });
  }

  async checkIsAddressUnderTheServiceRadius(
    params: CheckStoreIsServiceableDto,
  ) {
    const store = await this.storeRepo.findOne({ id: params.storeId });
    this.storeValidator.checkStoreLatLong(store);
    if (
      !this.isWithinRadius(
        0.0,
        0.0,
        Number(store?.latitude),
        Number(store?.longitude),
        Number(store?.serviceRadius),
      )
    ) {
      throw new BadRequestException('Store is not serviceable');
    }
    return { store };
  }

  private isWithinRadius(
    lat1: Decimal | number,
    lon1: Decimal | number,
    lat2: Decimal | number,
    lon2: Decimal | number,
    radiusKm = 30,
  ): boolean {
    lat1 = Number(lat1);
    lon1 = Number(lon1);
    lat2 = Number(lat2);
    lon2 = Number(lon2);
    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusKm;
  }
}
