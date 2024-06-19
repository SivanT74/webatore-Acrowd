import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/SubcategoryPage.module.css';

const SubcategoryPage = () => {
  const [products, setProducts] = useState([]); // list of products
  const [loading, setLoading] = useState(true);// loading
  const [error, setError] = useState(null); // error
  const router = useRouter(); // navigation
  const { category, subcategory } = router.query; // sets categorys in cons

  useEffect(() => {
    if (!category || !subcategory) return; // if no categorys found try again

    // get data 
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
        const filteredProducts = allProducts.filter(product => {
          const productCategories = product.categories.map(cat => cat.name.toLowerCase());
          return productCategories.includes(category.toLowerCase()) && productCategories.includes(subcategory.toLowerCase());
        });

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Head>
        <title>{category.charAt(0).toUpperCase() + category.slice(1)} - {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} - Shop</title>
        <meta name="description" content={`Browse products in the ${subcategory} category of ${category}.`} />
      </Head>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => router.push(`/category/${category}`)}>{'<'}</button>
        <h1>{category.charAt(0).toUpperCase() + category.slice(1)} - {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} - Shop</h1>
      </header>
      <div className={styles.productList}>
        {products.map((product) => (
          <div key={product.id} className={styles.productItem}>
            <Link href={`/product/${product.slug}`}>
              <a className={styles.imageContainer}>
                {product.images && product.images.length > 0 && (
                  <Image width={150} height={150} src={product.images[0].src} alt={product.name} />
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

// makes easy to import
export default SubcategoryPage;
