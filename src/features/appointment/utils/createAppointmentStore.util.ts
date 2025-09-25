import { EmployeeEntity } from "@/features/ticket/types/TicketResponse";
import { AppointmentFormState } from "../stores/createAppointmentStore";
import { useCustomerStore } from "../stores/customerStore";
import { dateFromTimeEntity, TimeRange } from "../types/CompanyProfileResponse";
import { CustomerEntity } from "../types/CustomerResponse";

export function validBookings(state: AppointmentFormState,setAlertMessage: (msg: string) => void, selectedCustomer?: CustomerEntity): boolean {
  if (!selectedCustomer) {
    setAlertMessage("Please select a customer");
    return false;
  }
  const listBooking = state.listBookingServices.filter(item => item.service !== null);
  if (listBooking.length < 1) {
    setAlertMessage("Please add at least one service");
    return false;
  }
  for (const item of listBooking) {
    if (item.service?.menuItemType !== "ServicePackage" && !item.technician) {
      setAlertMessage(`Please select a technician for service: ${item.service?.name}`);
      return false;
    }
    if (item.service?.menuItemType === "ServicePackage" && item.comboItems?.some(c => !c.technician)) {
        const unassignedService = item.comboItems.find(c=>!c.technician)?.service?.name
        setAlertMessage(`Please select a technician for service: ${unassignedService}`);
        return false;
    }
  }
  return true;
}

export function isValidTime(selectedDate: Date, totalDuration: number, businessHours: any, setAlertMessage: (msg: string) => void): boolean {
  const timeRange = getWorkHourByDay(businessHours, selectedDate);
  if (!timeRange) {
    setAlertMessage("This day is not a working day.");
    return false;
  }
  const bookingEnd = new Date(selectedDate.getTime() + totalDuration * 60000);
  const workEnd = dateFromTimeEntity(selectedDate, timeRange.end);
  if (bookingEnd > workEnd) {
    setAlertMessage("Appointment time must not exceed the end of the working day.");
    return false;
  }
  return true;
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

export function isEmployeeAvailableForDay (employee: EmployeeEntity, bookingDate: Date): boolean {
  if (!employee.workHours) return true;
  const workHourForDay = getWorkHourByDay(employee.workHours, bookingDate);
  return !!workHourForDay; // Simple check if they work on that day. Time check can be more granular if needed.
};