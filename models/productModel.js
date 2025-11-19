import { supabase } from '../utils/supabaseClient';

const table = 'products';

export async function getAll() {
  const { data, error } = await supabase.from(table).select('*');
  return { data, error };
}

export async function insert(product) {
  const { data, error } = await supabase.from(table).insert([product], { returning: 'representation' });
  return { data, error };
}

export async function updateById(id, updates) {
  const { data, error } = await supabase.from(table).update(updates, { returning: 'representation' }).eq('id', id);
  return { data, error };
}

export async function deleteById(id) {
  const { data, error } = await supabase.from(table).delete().eq('id', id);
  return { data, error };
}

export async function searchByName(q) {
  const { data, error } = await supabase.from(table).select('*').ilike('name', `%${q}%`);
  return { data, error };
}

export async function findById(id) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  return { data, error };
}
