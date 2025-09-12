/**
 * Đại diện cho cấu trúc địa chỉ.
 */
export interface Address {
  address: string;
  unitNumber: string;
  city: string;
  state: string;
  zip: string;
}

/**
 * Đại diện cho thông tin của cửa hàng.
 */
export interface StoreInfo {
  id: string;
  dbaName: string;
  mid: string;
  phoneNumber: string;
  ownerName: string;
  ownerPhone: string;
  address: Address;
  googleUrl: string;
  facebookUrl: string;
}

/**
 * Đại diện cho thông tin của khách hàng.
 */
export interface CustomerInfo {
  id: string;
  phone: string;
  cellPhone: string;
  email: string;
  firstName: string;
  lastName: string;
  pointsBalance: number;
  notes: string;
}

/**
 * Đại diện cho một phản hồi trong khảo sát (hiện tại là mảng rỗng).
 * Bạn có thể định nghĩa chi tiết hơn nếu nó có dữ liệu.
 */
export type SurveyResponse = any; // Hoặc định nghĩa chi tiết hơn: { responderId: string; text: string; ... }

/**
 * Interface chính, đại diện cho một mục khảo sát (Survey Item).
 * Đây là type cho mỗi phần tử trong mảng JSON của bạn.
 */
export interface SurveyItem {
  // --- Thông tin chính ---
  id: string;
  type: "Surveys";
  customerId: string;
  ticketId: string;
  waitListId: string;
  ticketNum: number;

  // --- Thời gian ---
  businessDate: string;   // Định dạng ISO 8601 Date String
  requestTime: string;    // Định dạng ISO 8601 Date String
  responseTime: string | null; // Có thể là null

  // --- Dữ liệu khảo sát ---
  rating: number;
  comment: string;
  isResponded: boolean;
  isRemoved: false;
  responses: SurveyResponse[];

  // --- Ghi chú ---
  notes: string;
  isNoteRead: boolean;

  // --- Thông tin lồng nhau ---
  customerInfo: CustomerInfo;
  storeInfo: StoreInfo;

  // --- Metadata ---
  createdBy: string;
  updatedBy: string;
  isDeleted: boolean;
  channels: string;
  uid: string[];
  createdAt: string;      // Định dạng ISO 8601 Date String
  updatedAt: string;      // Định dạng ISO 8601 Date String
  showMoreComment?: boolean
}

/**
 * Type cho toàn bộ response trả về từ API (một mảng các SurveyItem).
 */
export type SurveyListResponse = SurveyItem[];