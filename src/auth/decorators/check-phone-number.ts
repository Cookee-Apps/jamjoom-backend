import { Matches } from 'class-validator';

export const IsOnlyNumbers = () => {
  return Matches(/^\d+$/, { message: 'phoneNumber must contain only numbers' });
};
