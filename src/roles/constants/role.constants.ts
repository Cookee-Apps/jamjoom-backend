export type RoleNames = 'ADMIN' | 'CUSTOMER' | 'STORE_MANAGER';

export const RoleNamesObj: { [K in RoleNames]: K } = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  STORE_MANAGER: 'STORE_MANAGER'
};
