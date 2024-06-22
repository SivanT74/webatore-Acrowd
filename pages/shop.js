import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/ShopPage.module.css';
import { fetchProducts } from './api/fetchProducts'; 

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
                  <>
                    {console.log('Image URL:', product.images[0].src)}
                    <Image
                      src={product.images[0].src}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      quality={75}
                      sizes="(max-width: 768px) 100vw, 
                             (max-width: 1200px) 50vw, 
                             33vw"
                      placeholder="blur"
                      blurDataURL="/placeholder.webp"
                      loading="lazy"
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
