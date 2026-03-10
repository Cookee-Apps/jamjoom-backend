import { Injectable, NotFoundException } from '@nestjs/common';
import { BannerRepository } from '../repositories/banner.repository';
import { CreateBannerDto, GetAllBannersParamsDto, GetAllBannersResponseDTO, UpdateBannerDto } from '../dto/banner.dto';

@Injectable()
export class BannerService {
    constructor(private readonly bannerRepo: BannerRepository) { }

    async createBanner(dto: CreateBannerDto) {
        return await this.bannerRepo.insert(dto);
    }

    async updateBanner(dto: UpdateBannerDto) {
        const { id, ...data } = dto;
        const banner = await this.bannerRepo.findOne({ id });
        if (!banner) throw new NotFoundException('Banner not found');
        return await this.bannerRepo.update(id, data);
    }

    async deleteBanner(id: string) {
        const banner = await this.bannerRepo.findOne({ id });
        if (!banner) throw new NotFoundException('Banner not found');
        return await this.bannerRepo.delete(id);
    }

    async findAdminBanners(params: GetAllBannersParamsDto): Promise<GetAllBannersResponseDTO> {
        const [data, total] = await Promise.all([
            this.bannerRepo.findMany(
                params.storeId ? { storeId: params.storeId } : {},
                params.limit,
                params.skip,
            ),
            this.bannerRepo.count(params.storeId ? { storeId: params.storeId } : {}),
        ]);
        return { data, total };
    }

    async findCustomerBanners(storeId: string, limit?: number, skip?: number) {
        return await this.bannerRepo.findMany(
            {
                storeId,
                active: true,
            },
            limit,
            skip,
        );
    }

    async toggleBanner(id: string) {
        const banner = await this.bannerRepo.findOne({ id });
        if (!banner) throw new NotFoundException('Banner not found');
        return await this.bannerRepo.update(id, { active: !banner.active });
    }
}
