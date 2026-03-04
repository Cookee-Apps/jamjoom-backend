import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ConfigurationDto,
  UpdateBannerConfigDTO,
} from '../dto/configuration.dto';
import { ConfigurationRepository } from '../repositories/configuration.repository';
import { configKeysWithValidation } from '../constants/configuration.constant';
import { ConfigKey } from '../interfaces/configuration.dto.interface';
import {
  IUploadService,
  IUploadServiceToken,
} from 'utils/file-upload/IUploadService';

@Injectable()
export class ConfigurationService implements OnModuleInit {
  constructor(
    private readonly configurationRepo: ConfigurationRepository,
    @Inject(IUploadServiceToken) private readonly uploadService: IUploadService,
  ) {}

  async onModuleInit() {
    const config = await this.configurationRepo.find();
    for (const eachConfig of configKeysWithValidation) {
      if (config.find((cfg) => cfg.key === eachConfig.key.toString())) continue;
      const newConfig: ConfigurationDto = {
        key: eachConfig.key,
        value: eachConfig.value,
      };
      await this.configurationRepo.insert(newConfig);
    }
  }
  async getConfiguration() {
    return await this.configurationRepo.find();
  }

  async updateConfiguration(dto: ConfigurationDto[]) {
    for (const eachConfig of dto) {
      await this.configurationRepo.update(eachConfig.key, eachConfig.value);
    }
  }

  async updateBannerImage(params: UpdateBannerConfigDTO) {
    let key = params.app ? ConfigKey.appBannerImage : ConfigKey.webBannerImage;
    const existing = await this.configurationRepo.findOne({ key });
    if (existing?.value && params.photo) {
      await this.uploadService.deleteFile(existing.value);
    }
    const uploadOutput = await this.uploadService.uploadFile(
      params.photo,
      `banners`,
    );
    await this.configurationRepo.update(key, uploadOutput.path);
    return { updated: true };
  }

  async getConfigurationByKey(key: ConfigKey) {
    const config = await this.configurationRepo.findOne({ key });
    return config?.value;
  }
}
