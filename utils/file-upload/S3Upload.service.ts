import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUploadService, UploadOutput } from './IUploadService';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class S3UploadService implements IUploadService, OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  private s3Client: S3Client;
  private bucketName: string;
  private tempPath = 'temp';

  async onModuleInit() {
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME') as string;
    const AWS_REGION = this.configService.get('AWS_REGION') as string;
    const AWS_IAM_ACCESS_KEY_ID = this.configService.get(
      'AWS_IAM_ACCESS_KEY_ID',
    ) as string;
    const AWS_IAM_SECRET_ACCESS_KEY = this.configService.get(
      'AWS_IAM_SECRET_ACCESS_KEY',
    ) as string;
    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_IAM_ACCESS_KEY_ID,
        secretAccessKey: AWS_IAM_SECRET_ACCESS_KEY,
      },
    });
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const fileExtension = originalName.split('.').pop();
    return `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
  ): Promise<UploadOutput> {
    const fileName = this.generateFileName(file.originalname);
    // remove leading slash if exists
    path = path.startsWith('/') ? path.slice(1) : path;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${path}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(command);
    return {
      fileName,
      originalName: file.originalname,
      path: `uploads/${path}/${fileName}`,
      timestamp: new Date(),
    };
  }

  async uploadFiles(
    files: Express.Multer.File[],
    path: string,
  ): Promise<UploadOutput[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, path));
    return Promise.all(uploadPromises);
  }

  private getS3FilePath(filePath: string): string {
    // remove the leading 'uploads' string
    return filePath.startsWith('uploads/') ? filePath.slice(8) : filePath;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: this.getS3FilePath(filePath),
    });
    await this.s3Client.send(deleteCommand);
    return true;
  }

  async deleteFiles(filePaths: string[]): Promise<boolean> {
    const deleteCommands = filePaths.map((filePath) => ({
      Key: this.getS3FilePath(filePath),
    }));
    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: deleteCommands,
      },
    });
    await this.s3Client.send(command);
    return true;
  }

  private async listAllUnderPath(prefix: string): Promise<string[]> {
    const command = new ListObjectsCommand({
      Bucket: this.bucketName,
      Prefix: `/${prefix}`,
    });

    const response = await this.s3Client.send(command);
    if (!response.Contents) return [];
    return response.Contents.map((item) => item.Key).filter(
      (key) => key !== undefined,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearTempDirectoryFiles(): Promise<boolean> {
    const response = await this.listAllUnderPath(this.tempPath);
    if (response.length > 0) {
      const deleteCommands = response.map((item) => ({
        Key: item,
      }));
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: deleteCommands,
        },
      });
      await this.s3Client.send(deleteCommand);
      return true;
    }
    return false;
  }

  async deleteDirectory(folderPath: string): Promise<boolean> {
    const response = await this.listAllUnderPath(folderPath);
    if (response.length > 0) {
      const deleteCommands = response.map((item) => ({
        Key: item,
      }));
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: deleteCommands,
        },
      });
      await this.s3Client.send(deleteCommand);
      return true;
    }
    return false;
  }

  async uploadBuffer(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    path: string,
  ): Promise<UploadOutput> {
    path = path.startsWith('/') ? path.slice(1) : path;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${path}/${fileName}`,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);

    return {
      fileName,
      originalName: fileName,
      path: `uploads/${path}/${fileName}`,
      timestamp: new Date(),
    };
  }
}
