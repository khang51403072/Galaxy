import xlog from '../../../core/utils/xlog';
import { AuthApi } from '../services/AuthApi';
import { useAuthStore } from '../stores/authStore';

export async function loginUser(email: string, password: string) {
  const res = await AuthApi.login(email, password);
  const login = useAuthStore.getState().storeLogin;
  await login(res?.data?.userName || "", res?.data?.token || "", password || "", res["employeeId"] || "", res?.data?.firstName || "", res?.data?.lastName || "");
}
