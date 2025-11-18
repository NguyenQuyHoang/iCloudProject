import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request) {
  const { name, category, amount, price, image_url, rate, comments, description, brand, sku } = await request.json();
  const { data, error } = await supabase.from('products').insert([{ 
    name, category, amount, price, image_url, rate, comments, description, brand, sku 
  }], { returning: 'representation' });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 201 });
}