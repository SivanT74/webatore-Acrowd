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
        <meta property="og:image" content="https://ogcdn.net/c078a98b-9a33-4eaf-a5cf-e5ebf3ea450c/v1/webstore-acrowd.vercel.app/Welcome%20to%20Our%20Shop/Discover%20our%20wide%20range%20of%20products%20and%20amazing%20deals.%20Shop%20now%20at%20our%20online%20store./https%3A%2F%2Fcdn.theopengraph.com%2Fproduction%2Fdocuments%2Fd564a463-1c51-4259-991d-0d17bf3e0391.jpg%3Ftoken%3D-hKrjcO4EFDmPh0lgxSanJdH2MZ9gYnfw4V87WUckbA%26height%3D800%26width%3D1200%26expires%3D33239188519/og.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="webstore-acrowd.vercel.app" />
        <meta property="twitter:url" content="https://webstore-acrowd.vercel.app/" />
        <meta name="twitter:title" content="Welcome to Our Shop" />
        <meta name="twitter:description" content="Discover our wide range of products and amazing deals. Shop now at our online store." />
        <meta name="twitter:image" content="../images/placeholder.webp" />

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
