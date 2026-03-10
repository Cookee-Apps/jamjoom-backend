import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateCurrentStoreDto {
    @IsUUID()
    @IsNotEmpty()
    storeId: string;
}
