import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IUploadServiceToken } from './IUploadService';
import { S3UploadService } from './S3Upload.service';
import { UploadsController } from './file-upload.controller';

const UploadProvider = {
  provide: IUploadServiceToken,
  useClass: S3UploadService,
};

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [Logger, UploadProvider],
  exports: [UploadProvider]
})
export class FileUploadModule {}
