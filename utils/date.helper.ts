import { AvailableDay } from '@prisma/client';
import { ValidationArguments } from 'class-validator';
import { registerDecorator } from 'class-validator';
import {
  addDays,
  addMinutes,
  addMonths,
  addWeeks,
  differenceInYears,
  endOfDay,
  endOfWeek,
  formatDate,
  isAfter,
  parse,
  startOfDay,
  subMonths,
  lastDayOfMonth,
  isThursday,
  subWeeks,
  subDays,
  addHours,
  differenceInHours,
  subHours,
  differenceInSeconds,
  differenceInMilliseconds,
  differenceInMinutes,
  Day,
  nextDay,
  isSameDay,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { ValidationOptions } from 'joi';
const timeZone = 'Asia/Dubai';
type Time = { hour: number; minutes: number; seconds: number };

const getCurrentTime = (): Time => {
  const date = getCurrentDate();
  return {
    hour: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
};

// changes except time
const changeDate = (date: Date, dateToChangeTo: Date): Date => {
  date.setFullYear(dateToChangeTo.getFullYear());
  date.setMonth(dateToChangeTo.getMonth());
  date.setDate(dateToChangeTo.getDate());
  return date;
};

const changeDateToCurrentDate = (date: Date): Date => {
  const currentDate = getCurrentDate();
  return changeDate(date, currentDate);
};

const getYearsCount = (earlyDate: Date, lateDate: Date = new Date()) =>
  differenceInYears(lateDate, earlyDate);

type DateFormats = 'dd-MM-yyyy' | 'hh:mm aa' | 'hh aa' | 'KK a' | 'EEEE' | 'i' | 'yyyy-MM' | 'dd-MM-yyyy hh:mm aa'

const format = (date: Date, format: DateFormats = 'dd-MM-yyyy') =>
  formatDate(toZonedTime(date, timeZone), format);

const getTwelveHourTimeFromDate = (date: Date) => format(date, 'hh aa');

const convertAnyDateToNativeDate = (
  dateString = '',
  end = false,
  start = false,
  format = 'yyyy-MM-dd',
  utcDate = true,
): Date => {
  // dateString should be in DD-MM-YYYY format
  // const generatedDate = parse(dateString, format, new Date());
  let generatedDate = parse(dateString, format, new Date());
  // const localDate = toZonedTime(generatedDate, 'Asia/Kolkata');
  if (end) generatedDate = endOfDay(generatedDate);
  else if (start) generatedDate = startOfDay(generatedDate);
  return utcDate ? getUTCTime(generatedDate) : generatedDate;
};

const addDaysToDate = (dayCount: number, date = new Date()) =>
  addDays(date, dayCount);
const addWeekToDate = (weekCount: number, date = new Date()) =>
  addWeeks(date, weekCount);
const subWeekFromDate = (weekCount: number, date = new Date()) =>
  subWeeks(date, weekCount);
const addMinutesToDate = (minuteCount: number, date = new Date()) =>
  addMinutes(date, minuteCount);

const addHoursToDate = (hourCount: number, date = new Date()) =>
  addHours(date, hourCount);

const getCurrentDate = (start = false, end = false) => {
  let date = new Date();
  if (start) date = startOfDay(date);
  if (end) date = endOfDay(date);
  return date;
};

const isAfterDate = (dateA: Date, dateB: Date = new Date()) =>
  isAfter(dateA, dateB);

const getWeekEndDate = (date: Date) => endOfWeek(date, { weekStartsOn: 0 });
const getUTCTime = (date: Date) => fromZonedTime(date, timeZone);

const subMonthFromAMonth = (date: Date, monthCount: number) =>
  subMonths(date, monthCount);

const getLastThursdayOfMonth = (date: Date = new Date()) => {
  const lastDay = lastDayOfMonth(date);
  let currentDay = lastDay;
  let count = 0;
  while (!isThursday(currentDay) && count < 7) {
    currentDay = subDays(currentDay, 1);
    count++;
  }
  return currentDay;
};

const diffInHours = (dateA: Date, dateB: Date = new Date()) =>
  differenceInHours(dateB, dateA);
const diffInSeconds = (dateA: Date, dateB: Date = new Date()) =>
  differenceInSeconds(dateB, dateA);

const diffInMinutes = (dateA: Date, dateB: Date = new Date()) =>
  differenceInMinutes(dateB, dateA);

const diffInMilliSeconds = (dateA: Date, dateB: Date = new Date()) =>
  differenceInMilliseconds(dateB, dateA);

const subtractHours = (amount: number, date: Date = new Date()) =>
  subHours(date, amount);

const getDayName = (date: Date = new Date()) => format(date, 'EEEE');
const getDayNumber = (date: Date = new Date()) => format(date, 'i')

export function MinDateProp(relatedKey: keyof any, opts?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'MinDateProp',
      target: object.constructor,
      propertyName,
      constraints: [relatedKey],
      options: opts,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [key] = args.constraints as [string];
          const other = (args.object as Record<string, any>)[key] as Date;
          return (
            !(value instanceof Date) ||
            !(other instanceof Date) ||
            value.getTime() >= other.getTime()
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [key] = args.constraints as [string];
          return `${args.property} must not be earlier than ${key}`;
        },
      },
    });
  };
}

const DayMap: Record<AvailableDay, Day> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 0,
};

function getNextDay(dayName: AvailableDay, date: Date = new Date()): Date {
  return nextDay(date, DayMap[dayName]);
}

function checkIsSameDay(dateA: Date, dateB: Date): boolean {
  return isSameDay(dateA, dateB);
}

export default {
  getYearsCount,
  getNextDay,
  getDayName,
  isAfterDate,
  getDayNumber,
  format,
  subHours: subtractHours,
  addMinutes,
  getCurrentTime,
  convertAnyDateToNativeDate,
  getTwelveHourTimeFromDate,
  subMonths: subMonthFromAMonth,
  addMonths,
  changeDateToCurrentDate,
  changeDate,
  addDaysToDate,
  getLastThursdayOfMonth,
  diffInSeconds,
  diffInHours,
  diffInMinutes,
  diffInMilliSeconds,
  subWeekFromDate,
  endOfDay,
  startOfDay,
  getCurrentDate,
  addMinutesToDate,
  addHoursToDate,
  getWeekEndDate,
  getUTCTime,
  addWeekToDate,
  MinDateProp,
  checkIsSameDay,
};
