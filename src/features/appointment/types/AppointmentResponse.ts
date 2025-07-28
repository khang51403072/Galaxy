// Appointment response types

import { ApiResponse } from "@/core/network/ApiResponse";

export type BlockEnd = {
  hours: number;
  minutes: number;
  nanos: number;
  seconds: number;
};

export type TedTechnician = {
  id: string;
  name: string;
};

export type Customer = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cellPhone: string;
};

export type AppointmentEntity = {
  apptId: string;
  isBlock: boolean;
  blockStart: BlockEnd;
  blockEnd: BlockEnd;
  apptDate: string;
  customer: Customer;
  employeeID: string;
  nickName: string;
  packageKey: string;
  packageId: string;
  packageName: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  startTime: BlockEnd;
  price: number;
  note: string;
  customerNote: string;
  foreColor: string;
  backColor: string;
  apptStatus: string;
  categoryName: string;
  apptConfirmStatus: string;
  ticketNumber: number;
  position: number;
  createdTechnician: TedTechnician;
  updatedTechnician: TedTechnician;
  deletedTechnician: TedTechnician;
  retentionType: string;
  groupApptColor: string;
  isQuickUpdate: boolean;
};

export type AppointmentResponse = ApiResponse<AppointmentEntity[]>;

// Utility functions
export const getDisplayName = (entity: AppointmentEntity): string => {
  return entity.customer.firstName + " " + entity.customer.lastName;
};

export const getCustomerPhone = (entity: AppointmentEntity): string => {
  return entity.customer.cellPhone || entity.customer.phone || 'No phone';
};

export const getCustomerEmail = (entity: AppointmentEntity): string => {
  return entity.customer.email || 'No email';
};

export const getServiceName = (entity: AppointmentEntity): string => {
  if (entity.serviceName && entity.serviceName.trim() !== '') {
    return entity.serviceName.replaceAll('<br />', '  ').trim().replaceAll('  ', '\n');
  }
  return entity.categoryName || 'Unknown Service';
};

export const getAppointmentDateTime = (entity: AppointmentEntity): string => {
  try {
    const date = new Date(entity.apptDate);
    const timeStr = `${entity.startTime.hours.toString().padStart(2, '0')}:${entity.startTime.minutes.toString().padStart(2, '0')}`;
    return date.toDDMMYYYY('/') + ' ' + timeStr;
  } catch (error) {
    return `${entity.apptDate} ${entity.startTime.hours}:${entity.startTime.minutes}`;
  }
};

export const getAppointmentDate = (entity: AppointmentEntity): string => {
  try {
    const date = new Date(entity.apptDate);
    return date.toDDMMYYYY('/');
  } catch (error) {
    return entity.apptDate;
  }
};

export const getAppointmentTime = (entity: AppointmentEntity): string => {
  try {
    const hours = entity.startTime.hours.toString().padStart(2, '0');
    const minutes = entity.startTime.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch (error) {
    return `${entity.startTime.hours}:${entity.startTime.minutes}`;
  }
};

export const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case 'checkout':
      return '#059669'; // emerald - completed
    case 'checkin':
      return '#F59E0B'; // yellow - in progress
    case 'confirmed':
      return '#10B981'; // green
    case 'scheduled':
      return '#3B82F6'; // blue
    case 'cancelled':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
};

export const getStatusText = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case 'checkout':
      return 'Completed';
    case 'checkin':
      return 'Check In';
    case 'confirmed':
      return 'Confirmed';
    case 'scheduled':
      return 'Scheduled';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status; // Return original status if not recognized
  }
};

export const getTechnicianName = (entity: AppointmentEntity): string => {
  return entity.nickName || entity.createdTechnician?.name || 'Unknown Technician';
};

export const getPrice = (entity: AppointmentEntity): string => {
  return `$${entity.price.toFixed(2)}`;
};

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