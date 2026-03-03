export class UploadOutput {
  path: string;
  fileName: string;
  originalName: string;
  timestamp: Date
}

export interface IUploadService {
  uploadFile(file: Express.Multer.File, path: string): Promise<UploadOutput>;
  uploadBuffer(buffer: Buffer, fileName: string, mimeType: string, path: string): Promise<UploadOutput>;
  uploadFiles(files: Express.Multer.File[], path: string): Promise<UploadOutput[]>
  deleteFiles(filePaths: string[]): Promise<boolean>
  deleteFile(filePath: string): Promise<boolean>;
  clearTempDirectoryFiles(): Promise<boolean>
}

export interface IUploadServiceResponse {
  uploadedFileName: string;
  size: number;
  mimeType: string;
}

export const IUploadServiceToken = Symbol('IUploadService');
