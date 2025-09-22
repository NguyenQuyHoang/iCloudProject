const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { name, description, price } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert({ name, description, price }, { returning: 'representation' });
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(201).json({ message: 'Insert successful, but no data returned' });
    return res.status(201).json(data);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}