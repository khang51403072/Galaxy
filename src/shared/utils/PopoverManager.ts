let currentClose: (() => void) | null = null;

export function registerPopover(onClose: () => void) {
  if (currentClose && currentClose !== onClose) {
    currentClose(); // Đóng popover cũ nếu có
  }
  currentClose = onClose;
}

export function unregisterPopover() {
  currentClose = null;
} 