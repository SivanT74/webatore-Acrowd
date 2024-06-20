import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/ShopPage.module.css';

const IndexPage = () => { 
  const [products, setProducts] = useState([]); // list of products
  const [loading, setLoading] = useState(true); // Sets page to loading
  const [error, setError] = useState(null); //Holds error if fetching fail
  const router = useRouter(); // navigation

  useEffect(() => { //runns only after render
    const fetchProducts = async () => { // fetches list of product
      try {
        const consumerKey = 'ck_4c0d8a4f83c78831c200e39d1f371e92d419d863'; 
        const consumerSecret = 'cs_1eb6c96b9a32942b52a868da3ad28698b15873ff'; 
        const apiUrl = 'https://shop-interview.acrowd.se/wp-json/wc/v3/products'; 

        const response = await axios.get(apiUrl, { // uses axios lib to req data
          auth: {
            username: consumerKey,
            password: consumerSecret,
          },
          params: {
            per_page: 20, // gets 20 items of data
          },
        });

        const allProducts = response.data; // the respons from woo
        const productsWithImages = allProducts.filter(product => product.images && product.images.length > 0); // include only prod with img
        setProducts(productsWithImages); // filters the list
        setLoading(false); // fetching set to complet
      } catch (error) { // if error 
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts(); // runs the fetching set above
  }, []);

  if (loading) { // runs oading
    return <p>Loading...</p>;
  }

  if (error) { // shows error on page
    return <p>Error: {error.message}</p>;
  }

  return ( 
    <div>
      <Head>
        <title>Shop - Your Online Store</title>
        <meta name="description" content="Browse a wide range of products in our online store. Find the best deals on accessories, men's clothing, and women's clothing." /> 
      </Head>
      <header className={styles.header}>
        <h1>Shop</h1>
        <nav className={styles.nav}> 
          <span onClick={() => router.push('/category/accessories')}>Accessories</span>
          <span onClick={() => router.push('/category/men')}>Men</span>  
          <span onClick={() => router.push('/category/women')}>Women</span>
        </nav>
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
                <a><h2>{product.name}</h2></a>
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
                    <a>${product.price}</a>
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

// makes page easy to import
export default IndexPage;