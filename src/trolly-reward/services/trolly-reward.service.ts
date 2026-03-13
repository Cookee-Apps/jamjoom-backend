import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TrollyRewardRepository } from '../repositories/trolly-reward.repository';
import { CreateTrollyRewardDto, UpdateTrollyRewardDto } from '../dto/trolly-reward.dto';
import { IUploadService, IUploadServiceToken } from 'utils/file-upload/IUploadService';

@Injectable()
export class TrollyRewardService {
    constructor(
        private readonly repository: TrollyRewardRepository,
        @Inject(IUploadServiceToken) private readonly uploadService: IUploadService
    ) { }

    async create(dto: CreateTrollyRewardDto) {
        let giftImage: string = ''
        if (dto.giftImage) {
            const upload = await this.uploadService.uploadFile(dto.giftImage, 'trolly-rewards');
            giftImage = upload.path
        }
        try {
            const { giftImage: _, ...data } = dto;
            return await this.repository.create({
                ...data,
                giftImage,
                store: { connect: { id: dto.storeId } }
            });
        } catch (error) {
            if (giftImage) await this.uploadService.deleteFile(giftImage)
            throw error
        }
    }

    async update(dto: UpdateTrollyRewardDto) {
        const { id, giftImage: file, ...data } = dto;
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('Trolly reward not found');

        let giftImage: string | undefined = undefined;
        if (file) {
            const upload = await this.uploadService.uploadFile(file, 'trolly-rewards');
            giftImage = upload.path
            // Optional: delete old image if replaced
            // if (existing.giftImage) await this.uploadService.deleteFile(existing.giftImage);
        }

        const updateData: any = { ...data };
        if (giftImage) updateData.giftImage = giftImage;
        if (dto.storeId) updateData.store = { connect: { id: dto.storeId } };

        return this.repository.update(id, updateData);
    }

    async delete(id: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('Trolly reward not found');
        return this.repository.delete(id);
    }

    async toggleActive(id: string) {
        const result = await this.repository.toggleActive(id);
        if (!result) throw new NotFoundException('Trolly reward not found');
        return result;
    }

    async findAllAdmin(params: { limit?: number; skip?: number; storeId?: string }) {
        const { limit, skip, storeId } = params;
        return this.repository.findAll({ take: limit, skip, storeId });
    }

    async findAllCustomer(params: { limit?: number; skip?: number; storeId?: string }) {
        const { limit, skip, storeId } = params;
        return this.repository.findAll({ take: limit, skip, storeId, active: true });
    }
}
