/**
 * Đại diện cho thông tin của người thực hiện hành động xóa.
 * Interface này có thể được tái sử dụng ở những nơi khác cần thông tin người dùng cơ bản.
 */
export interface DeletionUserInfo {
  /**
   * ID duy nhất của người dùng hoặc nhân viên thực hiện việc xóa.
   * Ví dụ: "user_789"
   */
  id: string;

  /**
   * Tên đầy đủ của người dùng.
   * Ví dụ: "John Doe"
   */
  name: string;
}

/**
 * Đại diện cho toàn bộ payload của yêu cầu xóa một cuộc hẹn.
 * Đây là interface chính bạn sẽ sử dụng cho request body.
 */
export interface DeleteAppointmentRequest {
  /**
   * ID của cuộc hẹn cần xóa.
   * Ví dụ: "appt_123456"
   */
  id: string;

  /**
   * Thông tin về người đã thực hiện hành động xóa.
   */
  deletedBy: DeletionUserInfo;
}