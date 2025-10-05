const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    const { data, error } = await supabase.from('products').select('*').ilike('name', `%${query}%`);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}