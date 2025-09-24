import { createClient } from '@supabase/supabase-js'; // Nhập module createClient từ thư viện Supabase để kết nối database

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Lấy URL của Supabase từ biến môi trường
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Lấy key ẩn danh của Supabase từ biến môi trường
const supabase = createClient(supabaseUrl, supabaseKey); // Khởi tạo client Supabase với URL và key để thực hiện các thao tác với database

export async function GET() {
  const { data, error } = await supabase.from('products').select('*'); // Lấy tất cả dữ liệu từ bảng products
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 }); // Trả về lỗi 500 nếu có lỗi xảy ra khi truy vấn, kèm thông báo lỗi
  }
  return new Response(JSON.stringify(data), { status: 200 }); // Trả về dữ liệu thành công dưới dạng JSON với mã trạng thái 200
}

export async function POST(request) {
  const { name, category, amount, price, image_url, rate, comments, description, brand, sku } = await request.json(); // Lấy tất cả các trường từ body
  const { data, error } = await supabase.from('products').insert([{ 
    name, category, amount, price, image_url, rate, comments, description, brand, sku 
  }], { returning: 'representation' }); // Thêm sản phẩm với tất cả trường và yêu cầu trả về dữ liệu
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 201 });
}