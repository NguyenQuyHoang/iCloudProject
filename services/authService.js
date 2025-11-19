import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Set process.env.JWT_SECRET for production.');
}

export async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new Error('Vui lòng nhập đầy đủ thông tin');
  }

  const { data: existingUser } = await userModel.findByEmail(email);
  if (existingUser) {
    const err = new Error('Email đã tồn tại');
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await userModel.createUser({ name, email, password: hashedPassword });
  if (error) throw error;
  return data[0];
}

export async function login({ email, password }) {
  if (!email || !password) throw new Error('Vui lòng nhập email và mật khẩu');

  const { data: user, error } = await userModel.findByEmail(email);
  if (error) throw error;
  if (!user) {
    const err = new Error('Email không tồn tại');
    err.code = 'NO_USER';
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Sai mật khẩu');
    err.code = 'WRONG_PASSWORD';
    throw err;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET || 'secret123', { expiresIn: '1d' });
  return { user: { id: user.id, name: user.name, email: user.email }, token };
}
