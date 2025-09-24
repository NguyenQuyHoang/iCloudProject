// pages/api/productsCart.js
import supabase from '../../api/config.api'; // Nhập client Supabase đã được cấu hình từ file config.api

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // GET /api/productsCart?q=timkiem&limit=20&offset=0
      // Lấy danh sách sản phẩm trong giỏ hàng với các tham số lọc (q), phân trang (limit, offset)
      const { q, limit, offset } = req.query;

      let query = supabase.from('products').select('*'); // Khởi tạo query để lấy tất cả cột từ bảng products

      if (q && q.trim() !== '') {
        // Tìm kiếm theo tên sản phẩm trong giỏ hàng (case-insensitive, chứa chuỗi q)
        query = query.ilike('name', `%${q}%`);
      }

      // Sắp xếp theo thời gian tạo giảm dần để lấy các sản phẩm mới nhất
      query = query.order('created_at', { ascending: false });

      // Phân trang: Ưu tiên range nếu có offset và limit, nếu không thì dùng limit đơn lẻ
      if (typeof offset !== 'undefined' && typeof limit !== 'undefined') {
        const off = parseInt(offset, 10) || 0; // Chuyển offset thành số nguyên, mặc định 0 nếu không hợp lệ
        const lim = parseInt(limit, 10) || 20; // Chuyển limit thành số nguyên, mặc định 20 nếu không hợp lệ
        query = query.range(off, off + lim - 1); // Áp dụng range cho phân trang
      } else if (limit) {
        query = query.limit(parseInt(limit, 10)); // Áp dụng giới hạn số lượng bản ghi nếu chỉ có limit
      }

      const { data, error } = await query; // Thực thi query và lấy kết quả

      if (error) return res.status(500).json({ error: error.message }); // Trả về lỗi 500 nếu có lỗi xảy ra
      return res.status(200).json({ data }); // Trả về dữ liệu thành công với mã 200
    }

    if (req.method === 'POST') {
      // POST /api/productsCart { name, category, amount, price, image_url, rate, comments, description, brand, sku }
      // Bảo mật: Endpoint này hiện không yêu cầu xác thực — nên thêm kiểm tra API key hoặc auth nếu đưa lên production
      // Lưu ý: Nếu đây là giỏ hàng, có thể cần bảng cart riêng hoặc thêm trường quantity cho sản phẩm
      const { 
        name, 
        category = '', 
        amount = 0, 
        price, 
        image_url = '', 
        rate = 0.0, 
        comments = [], 
        description = '', 
        brand = '', 
        sku = '' 
      } = req.body || {};

      // Kiểm tra các trường bắt buộc (name và price)
      if (!name || typeof price === 'undefined') {
        return res.status(400).json({ error: 'Thiếu trường name hoặc price' });
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{ 
          name, 
          category, 
          amount, 
          price, 
          image_url, 
          rate, 
          comments, 
          description, 
          brand, 
          sku 
        }])
        .select(); // Thêm sản phẩm vào giỏ hàng (bảng products) và yêu cầu trả về dữ liệu vừa thêm

      if (error) return res.status(500).json({ error: error.message }); // Trả về lỗi 500 nếu có lỗi khi thêm
      return res.status(201).json({ data }); // Trả về dữ liệu vừa thêm với mã 201
    }

    res.setHeader('Allow', ['GET', 'POST']); // Đặt header cho phép các phương thức GET và POST
    return res.status(405).end(`Method ${req.method} Not Allowed`); // Trả về lỗi 405 nếu phương thức không được hỗ trợ
  } catch (err) {
    console.error(err); // Ghi lại lỗi vào console để debug
    return res.status(500).json({ error: err.message || 'Server error' }); // Trả về lỗi 500 nếu có ngoại lệ không mong muốn
  }
}