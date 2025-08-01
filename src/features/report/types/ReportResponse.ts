// Report response types (optimized with type)

import { ApiResponse } from "@/core/network/ApiResponse";

export type TimeSheetEntity = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  nickName: string;
  avatar: string;
  businessDate: string;
  clockInDt: string | null;
  clockOutDt: string | null;
  isMultiClockIn: boolean;
};

export type TimeSheetResponse = ApiResponse<TimeSheetEntity[]>;

// Utility functions (extension-like)
export const getDisplayName = (entity: TimeSheetEntity): string =>
  `${entity.firstName} ${entity.lastName}`;

export const getClockIn = (entity: TimeSheetEntity): string =>
  entity.clockInDt ? formatTime(entity.clockInDt) : "N/A";

export const getClockOut = (entity: TimeSheetEntity): string =>
  entity.clockOutDt ? formatTime(entity.clockOutDt) : "N/A";

function formatTime(dateTime: string): string {
  try {
    const date = new Date(dateTime);
    return date.toHHMMDDMMYYYY('/');
  } catch (error) {
    return "Invalid time";
  }
}    
///Batch History
export type TransactionDailyReport = {
  id: string;
  number: number;
  referenceID: string;
  cardType: string;
  transactionType: string;
  last4: string;
  amount: number;
  tip: number;
  subtotal: number;
  surcharge: number;
  cashDiscount: number;
  transDate: string;
  businessDate: string;
  isAdjustTip: boolean;
  ticketNum: number;
  baseAmount: number;
  tipAmount: number;
};

export type TransactionReports = {
  transactionsCount: number;
  saleAmount: number;
  returnAmount: number;
  voidAmount: number;
  totalAmount: number;
};

export type BatchEntity = {
  batchDate: string;
  batchTime: string;
  application: string;
  batchNumber: number;
  businessDate: string;
  transactionReports: TransactionReports;
  transactionDailyReports: TransactionDailyReport[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  id: string;
  isDeleted: boolean;
  channels: string;
  uid: any[];
};

export type BatchHistoryResponse = ApiResponse<BatchEntity[]>;

// Utility functions for BatchEntity
export const getBatchDisplayName = (entity: BatchEntity): string =>
  `Batch ${entity.batchNumber} - ${entity.application}`;

export const getBatchDate = (entity: BatchEntity): string => {
  try {
    const date = new Date(entity.batchDate);
    return date.toDDMMYYYY('/');
  } catch (error) {
    return entity.batchDate;
  }
};

export const getBatchTime = (entity: BatchEntity): string => {
  try {
    const date = new Date(entity.batchTime);
    return date.toHHMMDDMMYYYY();
  } catch (error) {
    return entity.batchTime;
  }
};

export const getTotalTransactions = (entity: BatchEntity): number =>
  entity.transactionReports.transactionsCount;

export const getTotalAmount = (entity: BatchEntity): number =>
  entity.transactionReports.totalAmount;

export const getSaleAmount = (entity: BatchEntity): number =>
  entity.transactionReports.saleAmount;

export const getReturnAmount = (entity: BatchEntity): number =>
  entity.transactionReports.returnAmount;

export const getVoidAmount = (entity: BatchEntity): number =>
  entity.transactionReports.voidAmount;

// Date conversion utilities
export const parseISODate = (isoString: string): Date => {
  try {
    return new Date(isoString);
  } catch (error) {
    console.error('Error parsing ISO date:', isoString, error);
    return new Date();
  }
};

export const formatISODate = (isoString: string, format: 'date' | 'time' | 'datetime' = 'datetime'): string => {
  try {
    const date = parseISODate(isoString);
    
    switch (format) {
      case 'date':
        return date.toDDMMYYYY('/');
      case 'time':
        return date.toHHMMDDMMYYYY();
      case 'datetime':
        return `${date.toDDMMYYYY('/')} ${date.toHHMMDDMMYYYY()}`;
      default:
        return date.toDDMMYYYY('/');
    }
  } catch (error) {
    console.error('Error formatting ISO date:', isoString, error);
    return isoString;
  }
};

// Example usage:
// const isoString = "2025-07-08T21:45:49.519912+00:00";
// const date = parseISODate(isoString); // Date object
// const formatted = formatISODate(isoString, 'datetime'); // "08/07/2025 21:45"

