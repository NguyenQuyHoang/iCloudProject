import { searchHandler } from '../../../controllers/productController';

export default async function handler(req, res) {
  return searchHandler(req, res);
}