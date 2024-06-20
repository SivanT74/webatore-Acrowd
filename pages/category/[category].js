import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/CategoryPage.module.css';

const CategoryPage = () => {
  const [products, setProducts] = useState([]); // list of product
  const [loading, setLoading] = useState(true); // loading
  const [error, setError] = useState(null); // errors
  const router = useRouter(); // navigation
  const { category } = router.query; // makes categorys into const

  useEffect(() => {
    if (!category) return;

    // gets data
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://shop-interview.acrowd.se/wp-json/wc/v3/products`, {
          auth: {
            username: 'ck_4c0d8a4f83c78831c200e39d1f371e92d419d863',
            password: 'cs_1eb6c96b9a32942b52a868da3ad28698b15873ff',
          },
          params: { per_page: 20 },
        });
        const allProducts = response.data;
        const filteredProducts = allProducts.filter(product =>
          product.categories.some(cat => cat.name.toLowerCase() === category.toLowerCase())
        );

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Head>
        <title>{category.charAt(0).toUpperCase() + category.slice(1)} - Shop</title>
        <meta name="description" content={`Browse products in the ${category} category.`} />
      </Head>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push('/shop')}>{'<'}</button>
        <h1>{category.charAt(0).toUpperCase() + category.slice(1)} - Shop</h1>
        {['women', 'men'].includes(category.toLowerCase()) && (
          <nav className={styles.nav}>
            <span
              className={styles.subcategoryLink}
              onClick={() => router.push(`/category/${category.toLowerCase()}/shirts`)}
            >
              Shirts
            </span>
            <span
              className={styles.subcategoryLink}
              onClick={() => router.push(`/category/${category.toLowerCase()}/hoodies`)}
            >
              Hoodies
            </span>
          </nav>
        )}
      </header>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <Link href={`/product/${product.slug}`}>
              <a className={styles.imageContainer}>
                {product.images && product.images.length > 0 && (
                  <img src={product.images[0].src} alt={product.name} />
                )}
              </a>
            </Link>
            <div className={styles.productInfo}>
              <Link href={`/product/${product.slug}`}>
                <a className={styles.productLink}><h2>{product.name}</h2></a>
              </Link>
              <div className={styles.price}>
                {product.sale_price ? (
                  <>
                    <Link href={`/product/${product.slug}`}>
                      <a className={styles.regularPrice}>${product.regular_price}</a>
                    </Link>
                    <Link href={`/product/${product.slug}`}>
                      <a className={styles.salePrice}>${product.sale_price}</a>
                    </Link>
                  </>
                ) : (
                  <Link href={`/product/${product.slug}`}>
                    <a className={styles.productLink}>${product.price}</a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Makes easy to import
export default CategoryPage;
