// pages/api/products.js
import supabase from '../../api/config.api';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // GET /api/products?q=timkiem&limit=20&offset=0
      const { q, limit, offset } = req.query;

      let query = supabase.from('products').select('*');

      if (q && q.trim() !== '') {
        // tìm theo tên (case-insensitive, contains)
        query = query.ilike('name', `%${q}%`);
      }

      // sắp xếp theo thời gian tạo giảm dần
      query = query.order('created_at', { ascending: false });

      // paging: ưu tiên range nếu có offset & limit
      if (typeof offset !== 'undefined' && typeof limit !== 'undefined') {
        const off = parseInt(offset, 10) || 0;
        const lim = parseInt(limit, 10) || 20;
        query = query.range(off, off + lim - 1);
      } else if (limit) {
        query = query.limit(parseInt(limit, 10));
      }

      const { data, error } = await query;

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ data });
    }

    if (req.method === 'POST') {
      // POST /api/products  { name, description, price, image_url }
      // Bảo mật: endpoint này hiện không require auth — nên thêm kiểm tra API key hoặc auth nếu đưa lên production
      const { name, description = '', price, image_url = '' } = req.body || {};

      if (!name || typeof price === 'undefined') {
        return res.status(400).json({ error: 'Thiếu trường name hoặc price' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ name, description, price, image_url }])
        .select();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json({ data });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
