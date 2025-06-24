import xlog from '../../../core/utils/xlog';
import { HomeApi } from '../services/HomeApi';

export async function getProfile() {
  const res = await HomeApi.getProfile();
  xlog.info('login data ', {
    tag:"Home",
    extra: res?.data
  });
  
}
