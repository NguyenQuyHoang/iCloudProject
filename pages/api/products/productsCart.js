// pages/api/products/productsCart.js
import { handler as productsHandler } from '../../../controllers/productController';

export default async function handler(req, res) {
  return productsHandler(req, res);
}