import { register as registerHandler } from '../../../controllers/authController';

export default async function handler(req, res) {
  return registerHandler(req, res);
}
