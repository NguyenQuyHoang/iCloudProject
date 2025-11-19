import * as authService from '../services/authService.js';

export async function register(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = await authService.register(req.body || {});
    return res.status(201).json({ message: 'Đăng ký thành công', user });
  } catch (err) {
    if (err.code === 'EMAIL_EXISTS') return res.status(400).json({ message: err.message });
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}

export async function login(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const result = await authService.login(req.body || {});
    return res.json({ message: 'Đăng nhập thành công', ...result });
  } catch (err) {
    if (err.code === 'NO_USER' || err.code === 'WRONG_PASSWORD') return res.status(400).json({ message: err.message });
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}
