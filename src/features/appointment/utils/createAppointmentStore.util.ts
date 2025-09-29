import { EmployeeEntity } from "@/features/ticket/types/TicketResponse";
import { AppointmentFormState, BookingServiceEntity } from "../stores/createAppointment/createAppointmentStore";
import { useCustomerStore } from "../stores/customerStore";
import { CompanyProfileResponse, dateFromTimeEntity, TimeRange } from "../types/CompanyProfileResponse";
import { CustomerEntity } from "../types/CustomerResponse";
import { KeychainObject } from "@/shared/utils/keychainHelper";
import { ApptDetail } from "../types/ApptDetailsResponse";
import { LoginEntity, Permissions } from "@/features/auth/types/AuthTypes";

export type IsValidBookingParams = {
  state: AppointmentFormState;
  selectedCustomer?: CustomerEntity;
  selectedDate: Date;
  companyProfile?: CompanyProfileResponse;
  listBookingServices: BookingServiceEntity[];
}
export function validBookings(params: IsValidBookingParams): string | undefined {
  ///validate list booking service
  if (!params.selectedCustomer) {
    return "Please select a customer";
  }
  const listBooking = params.state.listBookingServices.filter(item => item.service !== null);
  if (listBooking.length < 1) {
    return "Please add at least one service";
  }
  for (const item of listBooking) {
    if (item.service?.menuItemType !== "ServicePackage" && !item.technician) {

      return `Please select a technician for service: ${item.service?.name}`;
    }
    if (item.service?.menuItemType === "ServicePackage" && item.comboItems?.some(c => !c.technician)) {
      const unassignedService = item.comboItems.find(c => !c.technician)?.service?.name
      return `Please select a technician for service: ${unassignedService}`;
    }
  }
  //Check time is valid
  const businessHours = params.companyProfile?.data.businessHours;
  const totalDuration = params.listBookingServices.reduce((acc, item) => acc + (item.service?.duration || 0), 0);
  const timeRange = getWorkHourByDay(businessHours, params.selectedDate);
  if (!timeRange) {
    return "This day is not a working day.";
  }
  const bookingEnd = new Date(params.selectedDate.getTime() + totalDuration * 60000);
  const workEnd = dateFromTimeEntity(params.selectedDate, timeRange.end);
  if (bookingEnd > workEnd) {
    return "Appointment time must not exceed the end of the working day.";
  }
  return undefined;
}


export function getWorkHourByDay(workHours: any, date: Date): TimeRange | null {
  if (!workHours) return null;
  const day = date.getDay();
  const days = [
    { check: workHours.isSun, from: workHours.sunFromHour, to: workHours.sunToHour },
    { check: workHours.isMon, from: workHours.monFromHour, to: workHours.monToHour },
    { check: workHours.isTue, from: workHours.tueFromHour, to: workHours.tueToHour },
    { check: workHours.isWed, from: workHours.wedFromHour, to: workHours.wedToHour },
    { check: workHours.isThu, from: workHours.thuFromHour, to: workHours.thuToHour },
    { check: workHours.isFri, from: workHours.friFromHour, to: workHours.friToHour },
    { check: workHours.isSat, from: workHours.satFromHour, to: workHours.satToHour }
  ];
  const currentDay = days[day];
  return currentDay.check ? { start: currentDay.from, end: currentDay.to } : null;
}

export function isEmployeeAvailableForDay(employee: EmployeeEntity, bookingDate: Date): boolean {
  if (!employee.workHours) return true;
  const workHourForDay = getWorkHourByDay(employee.workHours, bookingDate);
  return !!workHourForDay; // Simple check if they work on that day. Time check can be more granular if needed.
};

type IsAllowEditParams = {
  apptDetails: ApptDetail | null,
  json: KeychainObject | null

}
export function getIsAllowEdit(params: IsAllowEditParams): boolean {
  if (params.apptDetails === null) return true;
  const status = params.apptDetails.apptStatus.toLowerCase();
  if (status === "checkout" || status === "cancel") {
    return false;
  }
  const roles = params.json?.listRole || [];
  if (roles.includes(Permissions.MOVE_APPOINTMENT)) {
    return true;
  }
  return false;
}

type IsAllowDeleteParams = {
  apptDetails: ApptDetail | null,
  json: KeychainObject | null

}
export function getIsAllowDelete(params: IsAllowDeleteParams): boolean {
  let user: LoginEntity | null = params.json as LoginEntity
  if (params.apptDetails === null) return false;
  //check status first
  const status = params.apptDetails.apptStatus.toLowerCase();
  if (status != "checkin" && status != "checkout" && status != "completed") {
    return true;
  }
  /// is owner
  if (user.isOwner) return true;
  ///list role have DELETE_APPOINTMENT flag
  if (user?.listRole?.includes(Permissions.DELETE_APPOINTMENT)) {
    return true;
  }

  return false;
}