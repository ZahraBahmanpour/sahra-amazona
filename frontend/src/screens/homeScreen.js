import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomeScreen() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('/api/products');
      setProducts(result.data);
    };
    fetchData();
  });
  return (
    <div>
      <h1>Featured Products</h1>
      <div className="products">
        {products.map((p) => (
          <div key={p.slug} className="product">
            <Link to={`/product/${p.slug}`}>
              <img src={p.image} alt={p.name} />
            </Link>
            <div className="product-info">
              <Link to={`/product/${p.slug}`}>
                <p>{p.name}</p>
              </Link>
              <p>
                <strong>${p.price}</strong>
              </p>
              <button>Add To Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeScreen;
