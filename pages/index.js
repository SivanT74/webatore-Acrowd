import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/IndexPage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Head>
        <title>Welcome to Our Shop</title>
        <meta name="description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />

        <meta property="og:url" content="https://webstore-acrowd.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Welcome to Our Shop" />
        <meta property="og:description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />
        <meta property="og:description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="webstore-acrowd.vercel.app" />
        <meta property="twitter:url" content="https://webstore-acrowd.vercel.app/" />
        <meta name="twitter:title" content="Welcome to Our Shop" />
        <meta name="twitter:description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />
        <meta name="twitter:description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />

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
