import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Customer } from '@prisma/client';
import { IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';
import { ConvertToBoolean } from 'utils/boolean.helper';
import { TransformToBoolean } from 'utils/decorators/TransformToBoolean';
import { IPaginateResult } from 'utils/generic-interfaces/IPaginateResult';
import { ConvertToNumber, Limit, Skip } from 'utils/number.helper';
import {
  ICustomerGeneralDTO,
  IListCustomerParamsDTO,
} from '../interfaces/customers.dto.interface';

export class ListCustomersParamsDTO implements IListCustomerParamsDTO
{
  @Limit()
  limit: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
  @ApiPropertyOptional()
  @IsOptional()
  searchText: string;
  @ApiPropertyOptional({ enum: [1, -1] })
  @IsOptional()
  @ConvertToNumber()
  minWalletBalance: -1 | 1;
  @ApiPropertyOptional({ enum: [1, -1] })
  @IsOptional()
  @ConvertToNumber()
  orderCount: -1 | 1;
  @ApiPropertyOptional()
  @IsOptional()
  @TransformToBoolean()
  active: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  storeId?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @ConvertToBoolean()
  topCustomers: string;
  @Skip()
  skip: number;
}

export class CustomerDTO implements Customer {
  @ApiProperty()
  id: string;
  @ApiProperty()
  refNo: number;
  @ApiProperty()
  referralCode: string;
  @ApiProperty({ nullable: true })
  referredBy: string | null;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  points: number;
}

export class ListCustomersResponseDTO implements IPaginateResult<CustomerDTO> {
  @ApiProperty({ type: CustomerDTO, isArray: true })
  data: CustomerDTO[];
  @ApiProperty()
  totalCount: number;
}

export class CustomerUserGeneralDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;
}

export class CustomerGeneralDTO implements ICustomerGeneralDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user?: CustomerUserGeneralDTO;
}
