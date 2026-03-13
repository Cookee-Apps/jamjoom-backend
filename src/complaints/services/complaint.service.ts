import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ComplaintRepository } from '../repositories/complaint.repository';
import { CreateComplaintDto, UpdateComplaintDto } from '../dto/complaint.dto';
import { IUploadService, IUploadServiceToken } from 'utils/file-upload/IUploadService';
import TransactionService from 'utils/db/transaction.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComplaintService {
  constructor(
    private readonly repository: ComplaintRepository,
    private readonly transactionService: TransactionService,
    @Inject(IUploadServiceToken) private readonly uploadService: IUploadService,
  ) { }

  async create(dto: CreateComplaintDto) {
    const { photos, userId, categoryId, ...data } = dto;
    const uploaded = [] as string[];
    try {
      let photoCreate: { create: { url: string }[] } | undefined;
      if (photos && photos.length) {
        const uploads = await this.uploadService.uploadFiles(photos, 'complaints');
        uploaded.push(...uploads.map((u) => u.path));
        photoCreate = { create: uploads.map((u) => ({ url: u.path })) };
      }

      return await this.repository.create({
        ...data,
        user: { connect: { id: userId } },
        category: { connect: { id: categoryId } },
        photos: photoCreate,
      });
    } catch (error) {
      if (uploaded.length) await this.uploadService.deleteFiles(uploaded);
      throw error;
    }
  }

  async update(dto: UpdateComplaintDto) {
    return await this.transactionService.runTransaction(async (tx) => {
      const { id, photos, ...data } = dto;
      const existing = await this.repository.findById(id, tx);
      if (!existing) throw new NotFoundException('Complaint not found');

      let photoCreate;
      const uploaded = [] as string[];
      if (photos && photos.length) {
        const uploads = await this.uploadService.uploadFiles(photos, 'complaints');
        uploaded.push(...uploads.map((u) => u.path));
        photoCreate = { create: uploads.map((u) => ({ url: u.path })) };
      }

      const photosToDelete = dto.photosToDelete || [];
      if (photosToDelete.length) {
        for (const photoId of photosToDelete) {
          const photo = await tx.complaintPhoto.delete({ where: { id: photoId } });
          if (photo) {
            await this.uploadService.deleteFile(photo.url);
          }
        }
      }

      try {
        const updateData: Prisma.ComplaintUpdateInput = { ...data };
        if (dto.categoryId) updateData.category = { connect: { id: dto.categoryId } };
        if (dto.userId) updateData.user = { connect: { id: dto.userId } };
        if (photoCreate) updateData.photos = photoCreate;

        return await this.repository.update(id, updateData, tx);
      } catch (error) {
        if (uploaded.length) await this.uploadService.deleteFiles(uploaded);
        throw error;
      }
    })
  }

  async delete(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundException('Complaint not found');

    const photoUrls = existing.photos?.map((p) => p.url) ?? [];
    const deleted = await this.repository.delete(id);
    if (photoUrls.length) await this.uploadService.deleteFiles(photoUrls);
    return deleted;
  }

  async getById(id: string) {
    const complaint = await this.repository.findById(id);
    if (!complaint) throw new NotFoundException('Complaint not found');
    return complaint;
  }

  async findAllAdmin(params: { limit?: number; skip?: number }) {
    const { limit, skip } = params;
    return this.repository.findAll({ take: limit, skip });
  }

  async findAllByCustomer(userId: string, params: { limit?: number; skip?: number }) {
    const { limit, skip } = params;
    return this.repository.findAll({ userId, take: limit, skip });
  }
}
