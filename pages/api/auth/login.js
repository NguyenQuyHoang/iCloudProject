import { login as loginHandler } from '../../../controllers/authController';

export default async function handler(req, res) {
  return loginHandler(req, res);
}
