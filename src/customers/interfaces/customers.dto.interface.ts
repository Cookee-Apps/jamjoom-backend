import { IPaginateFind } from 'utils/generic-interfaces/IPaginateFind';

export interface IListCustomerParamsDTO extends IPaginateFind {
  phoneNumber: string;
}

export interface ICustomerGeneralDTO {
  id: string;
  user?: { firstName: string; lastName: string; phoneNumber: string };
}
