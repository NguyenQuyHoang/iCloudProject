import { supabase } from '../utils/supabaseClient';

const table = 'users';

export async function findByEmail(email) {
  const { data, error } = await supabase.from(table).select('*').eq('email', email).single();
  return { data, error };
}

export async function createUser({ name, email, password }) {
  const { data, error } = await supabase.from(table).insert([{ name, email, password }]).select();
  return { data, error };
}

export async function findById(id) {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
  return { data, error };
}
