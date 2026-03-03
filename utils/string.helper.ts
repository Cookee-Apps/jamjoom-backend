import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ToWords } from 'to-words';
const toWords = new ToWords({
  converterOptions: {
    currency: true,
    currencyOptions: {
      name: 'Dirham',
      plural: 'Dirhams',
      symbol: 'AED',
      fractionalUnit: {
        name: 'Fils',
        plural: 'Fils',
        symbol: '',
      },
    },
  },
});

export const generateOTP = (length: number = 5): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export const generateFNameAndLName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const fname = parts[0] || '';
  const lname = parts.slice(1).join(' ') || '';
  return [fname, lname];
};

export function getFullName(
  firstName?: string,
  lastName?: string,
): string | undefined {
  if (!firstName && !lastName) {
    return undefined;
  }
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ');
}

export const AmountInWords = (amount: number) => {
  return toWords.convert(amount);
};

export const OptionalString = (args?: ApiPropertyOptions) =>
  applyDecorators(ApiPropertyOptional(args), IsString(), IsOptional());
export const NotEmptyString = () =>
  applyDecorators(ApiProperty(), IsNotEmpty(), IsString());
export const UUIDString = () =>
  applyDecorators(ApiProperty(), NotEmptyString(), IsUUID());

export const generateReferralCode = (): string => {
  const prefix = 'SPIN';
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomAlphabets = Array.from(
    { length: 3 },
    () => alphabets[Math.floor(Math.random() * alphabets.length)],
  ).join('');
  const numberTail = Math.floor(Math.random() * 1000); // Generates a number between 0 and 999
  // Pad the number with leading zeros to ensure it is always 3 digits
  // e.g., 5 becomes '005', 50 becomes '050', 500 becomes '500'
  // This ensures the final code is always 8 characters long
  // e.g., 'SPINABC005', 'SPINXYZ050', 'SPINLMN500'
  return `${prefix}${randomAlphabets}${numberTail.toString().padStart(3, '0')}`;
};

export function capitalize(
  str: string,
  capitalizeAllWords: boolean = false,
): string {
  if (typeof str !== 'string' || str.length === 0) return '';

  if (capitalizeAllWords) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
