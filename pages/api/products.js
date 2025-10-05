const { createClient } = require('@supabase/supabase-js'); // Nhập module createClient từ thư viện Supabase để kết nối database

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // Lấy URL của Supabase từ biến môi trường
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Lấy key ẩn danh của Supabase từ biến môi trường
const supabase = createClient(supabaseUrl, supabaseKey); // Khởi tạo client Supabase với URL và key để thực hiện các thao tác với database

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase.from('products').select('*'); // Lấy tất cả dữ liệu từ bảng products
    if (error) return res.status(500).json({ error: error.message }); // Trả về lỗi 500 nếu có lỗi xảy ra khi truy vấn
    return res.status(200).json(data); // Trả về dữ liệu thành công với mã trạng thái 200
  } else if (req.method === 'POST') {
    const { name, category, amount, price, image_url, rate, comments, description, brand, sku } = req.body; // Lấy các trường dữ liệu từ body của yêu cầu POST
    const { data, error } = await supabase.from('products').insert({
      name, category, amount, price, image_url, rate, comments, description, brand, sku
    }, { returning: 'representation' }); // Thêm một sản phẩm mới vào bảng products và yêu cầu trả về dữ liệu vừa thêm
    if (error) return res.status(500).json({ error: error.message }); // Trả về lỗi 500 nếu có lỗi khi thêm sản phẩm
    if (!data || data.length === 0) { // Kiểm tra nếu dữ liệu trả về từ insert là rỗng
      const { data: newData, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }) // Sắp xếp theo created_at giảm dần để lấy bản ghi mới nhất
        .limit(1); // Giới hạn chỉ lấy 1 bản ghi
      if (fetchError) return res.status(500).json({ error: fetchError.message }); // Trả về lỗi 500 nếu có lỗi khi lấy dữ liệu bổ sung
      return res.status(201).json(newData[0] || { message: 'Insert successful, but no data returned' }); // Trả về bản ghi mới nhất hoặc thông báo nếu không có dữ liệu
    }
    return res.status(201).json(data[0]); // Trả về dữ liệu vừa thêm với mã trạng thái 201
  } else if (req.method === 'PATCH') {
    const { id } = req.query; // Lấy id từ query parameter để xác định sản phẩm cần cập nhật
    const { name, category, amount, price, image_url, rate, comments, description, brand, sku } = req.body; // Lấy các trường dữ liệu cần cập nhật từ body
    if (!id) return res.status(400).json({ error: 'ID is required' }); // Trả về lỗi 400 nếu thiếu id
    const updates = {}; // Tạo object để lưu các trường cần cập nhật
    if (name !== undefined) updates.name = name; // Thêm name vào updates nếu được cung cấp
    if (category !== undefined) updates.category = category; // Thêm category vào updates nếu được cung cấp
    if (amount !== undefined) updates.amount = amount; // Thêm amount vào updates nếu được cung cấp
    if (price !== undefined) updates.price = price; // Thêm price vào updates nếu được cung cấp
    if (image_url !== undefined) updates.image_url = image_url; // Thêm image_url vào updates nếu được cung cấp
    if (rate !== undefined) updates.rate = rate; // Thêm rate vào updates nếu được cung cấp
    if (comments !== undefined) updates.comments = comments; // Thêm comments vào updates nếu được cung cấp
    if (description !== undefined) updates.description = description; // Thêm description vào updates nếu được cung cấp
    if (brand !== undefined) updates.brand = brand; // Thêm brand vào updates nếu được cung cấp
    if (sku !== undefined) updates.sku = sku; // Thêm sku vào updates nếu được cung cấp
    const { data, error } = await supabase.from('products').update(updates, { returning: 'representation' }).eq('id', id); // Cập nhật sản phẩm với điều kiện id và yêu cầu trả về dữ liệu
    if (error) return res.status(500).json({ error: error.message }); // Trả về lỗi 500 nếu có lỗi khi cập nhật
    if (!data || data.length === 0) { // Kiểm tra nếu dữ liệu trả về từ update là rỗng
      const { data: updatedData, error: fetchError } = await supabase.from('products').select('*').eq('id', id).single(); // Lấy lại dữ liệu vừa cập nhật với điều kiện id
      if (fetchError) return res.status(500).json({ error: fetchError.message }); // Trả về lỗi 500 nếu có lỗi khi lấy dữ liệu
      return res.status(200).json(updatedData || { message: 'Update successful, but no data returned' }); // Trả về dữ liệu vừa cập nhật hoặc thông báo
    }
    return res.status(200).json(data[0]); // Trả về dữ liệu vừa cập nhật với mã trạng thái 200
  } else if (req.method === 'DELETE') {
    const { id } = req.query; // Lấy id từ query parameter để xác định sản phẩm cần xóa
    if (!id) return res.status(400).json({ error: 'ID is required' }); // Trả về lỗi 400 nếu thiếu id
    const { data, error } = await supabase.from('products').delete().eq('id', id); // Xóa sản phẩm với điều kiện id
    if (error) return res.status(500).json({ error: error.message }); // Trả về lỗi 500 nếu có lỗi khi xóa
    return res.status(200).json({ message: 'Product deleted successfully' }); // Trả về thông báo xóa thành công với mã 200
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // Trả về lỗi 405 nếu phương thức không được hỗ trợ
  }
}