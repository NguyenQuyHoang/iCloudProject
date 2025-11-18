import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: true, // Bật body parser cho Next.js
  },
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, limit = 10 } = req.query; // Lấy tham số tìm kiếm và giới hạn (mặc định 10)
  if (!q) {
    return res.status(400).json({ error: 'Search query "q" is required' });
  }

  try {
    console.log('Searching with query:', q, 'limit:', limit); // Debug: Log tham số
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order('created_at', { ascending: false }) // Sắp xếp mới nhất trước
      .limit(parseInt(limit, 10)); // Giới hạn số lượng kết quả

    if (error) throw error;

    console.log('Search results count:', data?.length || 0); // Debug: Log số lượng kết quả
    res.status(200).json({ results: data || [] });
  } catch (err) {
    console.error('Search error:', err.message); // Debug: Log lỗi chi tiết
    res.status(500).json({ error: 'Failed to search products', details: err.message });
  }
}