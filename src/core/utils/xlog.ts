/**
 * xlog - Logger chuẩn cho project React Native
 * --------------------------------------------
 * - Dev: log ra console (info, warn, error, debug), có format rõ ràng, hỗ trợ tag, extra info.
 * - Prod: log gửi lên server hoặc bên thứ 3 (Sentry, ...), dễ mở rộng.
 *
 * API:
 *   xlog.info(message, options?)
 *   xlog.warn(message, options?)
 *   xlog.error(message, options?)
 *   xlog.debug(message, options?)
 *
 * Options:
 *   - tag: string (tên module, ví dụ: 'Auth', 'API', ...)
 *   - extra: object (dữ liệu bổ sung, ví dụ: error, user, ...)
 *
 * Ví dụ:
 *   import xlog from 'src/core/utils/xlog';
 *
 *   xlog.info('Đăng nhập thành công', { tag: 'Auth', extra: { userId: '123' } });
 *   xlog.error('Lỗi đăng nhập', { tag: 'Auth', extra: error });
 *
 * Mở rộng:
 *   - Sửa hàm sendLogToServer để tích hợp gửi log lên server hoặc Sentry, Bugsnag, ...
 *   - Có thể thêm các level khác nếu cần (trace, fatal, ...)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface XLogOptions {
  level?: LogLevel;
  tag?: string;
  extra?: any;
}

function sendLogToServer(level: LogLevel, message: string, options?: XLogOptions) {
  // TODO: Gửi log lên server hoặc bên thứ 3 (Sentry, ...)
  // fetch('https://your-log-server.com/log', { method: 'POST', body: ... })
}

function formatMsg(level: LogLevel, message: string, options?: XLogOptions) {
  const tag = options?.tag ? `[${options.tag}]` : '';
  return `${new Date().toISOString()} [${level.toUpperCase()}]${tag} ${message}`;
}

const xlog = {
  info(message: string, options?: XLogOptions) {
    if (__DEV__) {
      console.info(formatMsg('info', message, options), options?.extra || '');
    } else {
      sendLogToServer('info', message, options);
    }
  },
  warn(message: string, options?: XLogOptions) {
    if (__DEV__) {
      console.warn(formatMsg('warn', message, options), options?.extra || '');
    } else {
      sendLogToServer('warn', message, options);
    }
  },
  error(message: string, options?: XLogOptions) {
    if (__DEV__) {
      console.error(formatMsg('error', message, options), options?.extra || '');
    } else {
      sendLogToServer('error', message, options);
    }
  },
  debug(message: string, options?: XLogOptions) {
    if (__DEV__) {
      console.debug(formatMsg('debug', message, options), options?.extra || '');
    } else {
      sendLogToServer('debug', message, options);
    }
  },
  // Có thể mở rộng thêm các level khác nếu cần
};

export default xlog; 