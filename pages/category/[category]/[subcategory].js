import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../../styles/SubcategoryPage.module.css';
import { fetchProducts } from '../../api/fetchProducts';
import ImageComponent from '../../api/ImageComponent'; // Adjust the path as necessary

export async function getStaticPaths() {
  // Define paths for all the subcategories
  const categories = ['accessories', 'men', 'women'];
  const subcategories = ['shirts', 'hoodies'];

  const paths = categories.flatMap(category =>
    subcategories.map(subcategory => ({
      params: { category, subcategory },
    }))
  );

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { category, subcategory } = params;
  const products = await fetchProducts(category, subcategory);

  return {
    props: {
      products,
      category,
      subcategory,
    },
    revalidate: 10,
  };
}

const SubcategoryPage = ({ products, category, subcategory }) => {
  const router = useRouter();

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

export default SubcategoryPage;
