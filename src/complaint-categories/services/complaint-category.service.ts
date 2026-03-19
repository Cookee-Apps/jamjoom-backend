import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ComplaintCategoryRepository } from '../repositories/complaint-category.repository';
import { CreateComplaintCategoryDto, UpdateComplaintCategoryDto } from '../dto/complaint-category.dto';
import { IUploadService, IUploadServiceToken } from 'utils/file-upload/IUploadService';

@Injectable()
export class ComplaintCategoryService {
    constructor(
        private readonly repository: ComplaintCategoryRepository,
        @Inject(IUploadServiceToken) private readonly uploadService: IUploadService
    ) { }

    async create(dto: CreateComplaintCategoryDto) {
        let icon: string = ''
        if (dto.icon) {
            const upload = await this.uploadService.uploadFile(dto.icon, 'complaint-categories');
            icon = upload.path
        }
        try {
            const { icon: _, ...rest } = dto;
            return await this.repository.create({ ...rest, icon });
        } catch (error) {
            if (icon) await this.uploadService.deleteFile(icon)
            throw error
        }
    }

    async update(dto: UpdateComplaintCategoryDto) {
        const { id, icon: iconFile, ...data } = dto;
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('Complaint category not found');
        let icon: string = existing.icon;
        if (iconFile) {
            const upload = await this.uploadService.uploadFile(iconFile, 'complaint-categories');
            icon = upload.path
            if (existing.icon) await this.uploadService.deleteFile(existing.icon)
        }
        return this.repository.update(id, { ...data, icon });
    }

    async delete(id: string) {
        const existing = await this.repository.findById(id);
        if (!existing) throw new NotFoundException('Complaint category not found');
        const deleted = await this.repository.delete(id);
        if (existing.icon) await this.uploadService.deleteFile(existing.icon);
        return deleted;
    }

    async toggleActive(id: string) {
        const result = await this.repository.toggleActive(id);
        if (!result) throw new NotFoundException('Complaint category not found');
        return result;
    }

    async findAllAdmin(params: { limit?: number; skip?: number }) {
        const { limit, skip } = params;
        return this.repository.findAll({ take: limit, skip });
    }

    async findAllCustomer(params: { limit?: number; skip?: number }) {
        const { limit, skip } = params;
        return this.repository.findAll({ take: limit, skip, active: true });
    }

    async findById(id: string) {
        return this.repository.findById(id);
    }
}
