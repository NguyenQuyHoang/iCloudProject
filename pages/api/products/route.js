import * as productService from '../../../services/productService.js';

export async function GET() {
  try {
    const data = await productService.listAll();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await productService.create(body || {});
    return new Response(JSON.stringify(created), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}