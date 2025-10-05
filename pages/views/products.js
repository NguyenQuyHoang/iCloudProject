import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>{products.map(p => <li key={p.id}>{p.name} - ${p.price}</li>)}</ul>
    </div>
  );
}