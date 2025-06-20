export async function login(email: string, password: string) {
    // Giả lập delay API
    await new Promise((res) => setTimeout(res, 800));
  
    if (email === 'admin@example.com' && password === '123456') {
      return {
        userName: email,
        token: 'mock-token-abc123',
        secureKey: 'mock-secure-xyz789',
      };
    } else {
      throw new Error('Sai email hoặc mật khẩu!');
    }
  }
  