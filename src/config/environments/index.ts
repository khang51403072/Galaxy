// environments/index.ts
import Config from 'react-native-config';
import { development } from './development';
import { production } from './production';
import { qa } from './qa';
let env: any;

// Dựa vào biến được build bởi react-native-config để chọn object đúng
switch (Config.ENVIRONMENT) {
  case 'development':
    env = development;
    break;
  case 'production':
    env = production;
    break;
  case 'qa':
    env = qa;
    break;
  default:
    env = production; // Luôn có một fallback an toàn
    break;
}

export default env;

// Bạn cần thêm biến `ENVIRONMENT` vào các file .env của mình
// Ví dụ .env.staging: ENVIRONMENT=staging