export interface CompanyProfileResponse {
  result: boolean;
  errorMsg: string;
  data: CompanyProfileEntity;
}

export interface CompanyProfileEntity {
  isApplyToRetentionTypeForApptNewCustomer: boolean;
  isApplyToRetentionTypeForApptRequest: boolean;
  isApplyToRetentionTypeForApptNonRequest: boolean;
  isApplyToRetentionTypeForApptWalkIn: boolean;
  isApplyToRetentionTypeForApptOnline: boolean;
  giftCardType: string;
  mid: string;
  businessName: string;
  language: string;
  phone: string;
  fax: string;
  storeLogo: string;
  storeLogoForCheckIn: string;
  appointments: Appointments;
  businessHours: WorkHours;
  onlineHours: WorkHours;
  overtimeCalculationType: string;
  weekStartsOn: string;
  calculateCommissionOn: string;
  ownerPercent: number;
  employeePercent: number;
  isSubtractSurcharge: boolean;
  isEnableSupplyCharges: boolean;
  posTheme: PosTheme;
  miscPrinting: MiscPrinting;
  resetTime: ResetTime;
  isAutoReset: boolean;
  id: string;
}

export interface Appointments {
  isUseNewVersion: boolean;
  viewApptPriorDays: number;
  defaultRetentionType: string;
  timeInterval: number;
  isHideTimeInterval: boolean;
  isAllowAppointmentPriorToCurrentDate: boolean;
  isSortEmployeesByOrderOnAppointmentBook: boolean;
  isUseEmployeeColorForAppointmentHeader: boolean;
  isCombineAppointmentServiceOnAppointmentBook: boolean;
  isUseUnAssignHolder: boolean;
  isHorizontalMode: boolean;
  onlineApptMon: number;
  onlineApptTue: number;
  onlineApptWed: number;
  onlineApptThu: number;
  onlineApptFri: number;
  onlineApptSat: number;
  onlineApptSun: number;
  onlineApptMinMinuteFromCurrentTime: number;
  isDisableNextAvailableOnlineAppt: boolean;
  isHideOnlineApptPrice: boolean;
  isHideOnlineDuration: boolean;
  isDonotShowCategory: boolean;
  isBlockNoShowCustomers: boolean;
  isOnlineApptUseOverrideSchedule: boolean;
  isDisableLegacyAppointment: boolean;
  isHideEmployeeName: boolean;
  isAskEmail: boolean;
  isLimitFutureOnlineAppt: boolean;
  limitFutureOnlineApptDays: number;
  checkApptConflictBeforeAfter: number;
  isUseNewAppointmentUI: boolean;
  isApptServicesAllowForAll: boolean;
  isAllowQuickService: boolean;
  isCheckEmpAvailable: boolean;
  isDisplayConfirmOnlineAppt: boolean;
  isShowCustomerInfo: boolean;
  maxTechniciansPerFrame: number;
  isOvertimeAllowed: boolean;
  isRequestPreDeposit: boolean;
  visitDepositCount: number;
  preDepositAmount: number;
  depositMinAmount: number;
  preDepositType: string;
  refundPolicy: string;
  theme: string;
  isShowPreDeposit: boolean;
  fillColorType: string;
  isHideApptTime: boolean;
  isEnableZoom: boolean;
  isClickToCreateAppt: boolean;
  isAllowSameTechInApptGroup: boolean;
}

export interface WorkHours {
  from: string;
  to: string;
}

export interface PosTheme {
  inServiceForceColor: string;
  inServiceBackColor: string;
  checkOutForceColor: string;
  checkOutBackColor: string;
  blockForceColor: string;
  blockBackColor: string;
  heldOnForceColor: string;
  heldOnBackColor: string;
  returnRequestForceColor: string;
  returnRequestBackColor: string;
  newCustomerForceColor: string;
  newCustomerBackColor: string;
  nonRequestForceColor: string;
  nonRequestBackColor: string;
  walkinForceColor: string;
  walkinBackColor: string;
  onlineForceColor: string;
  onlineBackColor: string;
  doneForceColor: string;
  doneBackColor: string;
  leftSideWallpaper: string;
  rightSideWallpaper: string;
  miscForceColor: string;
  miscBackColor: string;
}

export interface MiscPrinting {
  isHideQRCodeReceipt: boolean;
  isPrintPayrollPercent: boolean;
  isPrintProductCommissionDetail: boolean;
  percent1: number;
  percent2: number;
  percent3: number;
  numberReceiptCashPayment: number;
  isPrintCCSlipOnReceipt: boolean;
  isPrintLoyaltyBalance: boolean;
  isPrintOwnerCCSlip: boolean;
  isPrintCustomerMessage: boolean;
  isHideTipLine: boolean;
  isPrintEMVInfo: boolean;
  isHideTicketTotalTip: boolean;
  isPrintSeparateSlip: boolean;
  isPrintWhenStatusIsInService: boolean;
  addOnLineNumber: number;
  isPrintCashCheckPayments: boolean;
  isPrintDetails: boolean;
  isPrintProductServiceCommission: boolean;
  isExcludeNonPaidTickets: boolean;
  isPrintEmployeeSaleOnClockOut: boolean;
  isPrintServiceCharge: boolean;
  isPrintSupplyCharge: boolean;
  isPrintClockInOutTime: boolean;
  isPrintTotalCommission: boolean;
  isPrintSalesByType: boolean;
  isCashForDrawers: boolean;
  isPaymentTypeDetails: boolean;
  isCashReconciliation: boolean;
  isDiscountSummary: boolean;
  isVoidSummary: boolean;
  isAverageCheck: boolean;
  isSalesByType: boolean;
  isCashReceivedByEmployee: boolean;
  isDiscountDetails: boolean;
  isVoidDetails: boolean;
  isActivatedGiftcards: boolean;
  addOnLineNumberOnWaitSlip: number;
  isPrintAfterBatchOut: boolean;
  isShowServiceHistory: boolean;
  isPrintPreview: boolean;
  isShowPayoutPercent: boolean;
  isShowCustomerOnPaid: boolean;
  isShowPaymentOnPaid: boolean;
  isShowCashReceived: boolean;
  isShowEmployeeDeductions: boolean;
}

export interface ResetTime {
  hours: number;
  minutes: number;
  nanos: number;
  seconds: number;
}
