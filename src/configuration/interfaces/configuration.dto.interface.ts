export interface IConfigurationDto {
  key: string;
  value: string;
}

export interface IConfigurationResponseDto {
  id: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConfigKey {
  referralBonus = 'REFERRAL_BONUS',
  refereeBonus = 'REFEREE_BONUS',

  webBannerImage = 'CUSTOMER_WEB_BANNER_IMAGE',
  appBannerImage = 'CUSTOMER_APP_BANNER_IMAGE',

  minWalletRecharge = 'MIN_WALLET_RECHARGE',
  vatPercentage = 'VAT_PERCENTAGE',

  stdPickupSlots = 'MIN_WAITING_SLOTS_FOR_STANDARD_PICKUP',
  stdDeliverySlots = 'MIN_WAITING_SLOTS_FOR_STANDARD_DELIVERY',

  minPickupSlots = 'MIN_WAITING_SLOTS_FOR_PICKUP',
  minDeliverySlots = 'MIN_WAITING_SLOTS_FOR_DELIVERY',

  expressServicePercentage = 'EXPRESS_SERVICE_PERCENTAGE',
  quickOrderCharge = 'QUICK_ORDER_CHARGE',

  adminPhoneNumber = 'ADMIN_PHONE_NUMBER',

  onlinePaymentEnabled = 'ONLINE_PAYMENT_ENABLED'
}
