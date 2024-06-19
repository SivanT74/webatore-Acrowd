import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/IndexPage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Head>
        <title>Welcome to Our Shop</title>
        <meta name="description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />
        <meta name="keywords" content="shop, online store, products, deals" />
      </Head>
      <h1>Welcome to Our Shop!</h1>
      <p>Discover our wide range of products and amazing deals.</p>
      <div className={styles.homeLinks}>
        <Link href="/shop"><a className={styles.homeLink}>Browse Categories</a></Link>
        <Link href="/cart"><a className={styles.homeLink}>Your Cart</a></Link>
        <Link href="/checkout"><a className={styles.homeLink}>Checkout</a></Link>
      </div>
    </div>
  );
};

// makes page easy to import
export default HomePage;
