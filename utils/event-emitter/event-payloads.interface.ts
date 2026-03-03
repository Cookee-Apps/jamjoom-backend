import { DamageNotifications, OrderStatus, OrderTypes } from "@prisma/client";

interface BasePayload {
  userId: string;
  orderId: string;
  orderStatus: OrderStatus
  pickupDriverId: string | null;
  deliveryDriverId: string | null;
}

export interface DamageReportedPayload extends BasePayload {
  damageDetails: DamageNotifications;
  orderType: OrderTypes;
}

export interface OrderStatusChangedPayload extends BasePayload {
  newStatus: OrderStatus;
  orderType: OrderTypes;
}

export interface DriverAssignedToOrderPayload extends BasePayload {
  activity: 'PICKUP' | 'DELIVERY';
  orderType: OrderTypes;
}

export interface OrderAdditionalChargesUpdatedPayload extends BasePayload {
  chargeAdded: number;
  orderType: OrderTypes;
}

export interface OrderCreatedPayload extends Pick<BasePayload, 'orderId'> {
  userIds: string[];
  orderRef: string;
  customerName: string;
  storePhone: string;
  customerPhone: string;
  orderDateTime: Date;
}

export interface IEventPayload {
  DAMAGE_REPORTED: DamageReportedPayload;
  ORDER_STATUS_CHANGED: OrderStatusChangedPayload;
  DRIVER_ASSIGNED_TO_ORDER: DriverAssignedToOrderPayload;
  ORDER_BULK_ASSIGNMENT: DriverAssignedToOrderPayload[];
  ORDER_ADDITIONAL_CHARGES_UPDATED: OrderAdditionalChargesUpdatedPayload;
  ORDER_CREATED: OrderCreatedPayload;
}
