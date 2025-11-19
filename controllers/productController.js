import * as productService from '../services/productService.js';

export async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await productService.listAll();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const created = await productService.create(req.body || {});
      return res.status(201).json(created);
    }

    if (req.method === 'PATCH') {
      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: 'ID is required' });
      const updated = await productService.update(id, req.body || {});
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: 'ID is required' });
      await productService.remove(id);
      return res.status(200).json({ message: 'Product deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('product handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function searchHandler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const { query } = req.query || {};
    if (!query) return res.status(400).json({ error: 'Query is required' });
    const data = await productService.search(query);
    return res.status(200).json(data);
  } catch (err) {
    console.error('search error:', err);
    return res.status(500).json({ error: err.message });
  }
}
