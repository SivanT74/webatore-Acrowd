import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/ShopPage.module.css';
import { fetchProducts } from './api/fetchProducts';
import ImageComponent from './api/ImageComponent'; // Adjust the path as necessary

export async function getStaticProps() {
  const productsData = await fetchProducts();

  return {
    props: {
      products: productsData,
    },
    revalidate: 10,
  };
}

const IndexPage = ({ products }) => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Shop - Your Online Store</title>
        <meta name="description" content="Explore our wide range of products and find what you need. Shop now and enjoy great deals!" />
        
        <meta property="og:url" content="https://webstore-acrowd.vercel.app/shop" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shop - Our Products" />
        <meta property="og:description" content="Explore our wide range of products and find what you need. Shop now and enjoy great deals!" />
        <meta property="og:image" content={`https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4/webstore-acrowd.vercel.app/Buy%20${encodeURIComponent(defaultProductName)}%20-%20Our%20Shop/${encodeURIComponent(defaultImage)}%20/og.png`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="webstore-acrowd.vercel.app" />
        <meta property="twitter:url" content="https://webstore-acrowd.vercel.app/shop" />
        <meta name="twitter:title" content="Shop - Our Products" />
        <meta name="twitter:description" content="Explore our wide range of products and find what you need. Shop now and enjoy great deals!" />
        <meta name="twitter:image" content={`https://ogcdn.net/6064b869-74ed-4eb9-b76c-0b701ffe7e6b/v4/webstore-acrowd.vercel.app/Buy%20${encodeURIComponent(defaultProductName)}%20-%20Our%20Shop/${encodeURIComponent(defaultImage)}%20/og.png`} />
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
                  <>
                    {console.log('Image URL:', product.images[0].src)}
                    <ImageComponent
                      src={product.images[0].src}
                      alt={product.name}
                    />
                  </>
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

export default IndexPage;
