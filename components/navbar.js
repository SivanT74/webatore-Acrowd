import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.hamburger} onClick={toggleNavbar}>
        
      </div>
      <ul className={`${styles.navList} ${isOpen ? styles.open : ''}`}>
        <li className={styles.navItem}><Link href="/"><a className={styles.navLink}>Home</a></Link></li>
        <li className={styles.navItem}><Link href="/shop"><a className={styles.navLink}>Shop</a></Link></li>
        <li className={styles.navItem}><Link href="/cart"><a className={styles.navLink}>Cart</a></Link></li>
        <li className={styles.navItem}><Link href="/checkout"><a className={styles.navLink}>Checkout</a></Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
