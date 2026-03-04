import { ConfigKey } from '../interfaces/configuration.dto.interface';

export const configKeysWithValidation = [
  {
    key: ConfigKey.referralBonus,
    type: 'number',
    value: '10',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.onlinePaymentEnabled,
    type: 'number',
    value: '1',
    validation: (value: string) => Number(value) === 1 || Number(value) === 0
  },
  {
    key: ConfigKey.minWalletRecharge,
    type: 'number',
    value: '40',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.webBannerImage,
    type: 'string',
    value: '',
    validation: (value: string) => {
      return value !== '';
    },
  },
  {
    key: ConfigKey.appBannerImage,
    type: 'string',
    value: '',
    validation: (value: string) => {
      return value !== '';
    },
  },
  {
    key: ConfigKey.vatPercentage,
    type: 'number',
    value: '15',
    validation: (value: string) => {
      const num = Number(value);
      return num >= 0 && num <= 100;
    },
  },
  {
    key: ConfigKey.refereeBonus,
    type: 'number',
    value: '10',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.stdDeliverySlots,
    type: 'number',
    value: '9',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.stdPickupSlots,
    type: 'number',
    value: '5',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.minPickupSlots,
    type: 'number',
    value: '3',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.quickOrderCharge,
    type: 'number',
    value: '10',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.expressServicePercentage,
    type: 'number',
    value: '35',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.minDeliverySlots,
    type: 'number',
    value: '5',
    validation: (value: string) => {
      return Number(value) > 0;
    },
  },
  {
    key: ConfigKey.adminPhoneNumber,
    type: 'string',
    value: '+971589532101',
    validation: (value: string) => {
      return value !== '';
    },
  }
];
