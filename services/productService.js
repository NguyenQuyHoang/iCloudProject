import * as productModel from '../models/productModel.js';

export async function listAll() {
  const { data, error } = await productModel.getAll();
  if (error) throw error;
  return data;
}

export async function create(product) {
  const { data, error } = await productModel.insert(product);
  if (error) throw error;
  return data[0] || null;
}

export async function update(id, updates) {
  const { data, error } = await productModel.updateById(id, updates);
  if (error) throw error;
  return data && data[0] ? data[0] : null;
}

export async function remove(id) {
  const { data, error } = await productModel.deleteById(id);
  if (error) throw error;
  return true;
}

export async function search(q) {
  const { data, error } = await productModel.searchByName(q);
  if (error) throw error;
  return data;
}
