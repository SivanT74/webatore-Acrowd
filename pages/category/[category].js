import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/CategoryPage.module.css';
import { fetchProducts } from '../api/fetchProducts';
import ImageComponent from '../api/ImageComponent'; // Adjust the path as necessary

export async function getStaticPaths() {
  // Define paths for all the categories
  const paths = ['accessories', 'men', 'women'].map((category) => ({
    params: { category },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { category } = params;
  const products = await fetchProducts(category);

  return {
    props: {
      products,
      category,
    },
    revalidate: 10,
  };
}

const CategoryPage = ({ products, category }) => {
  const router = useRouter();

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
                  <ImageComponent
                    src={product.images[0].src}
                    alt={product.name}
                  />
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

export default CategoryPage;
