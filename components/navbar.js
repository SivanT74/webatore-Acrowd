import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaShoppingCart } from 'react-icons/fa'; // Import FontAwesome cart icon
import styles from './style/Navbar.module.css';
import CartModal from './CartModal'; // Import the CartModal component

// Utility function to dispatch cart update events
import { dispatchCartUpdateEvent } from './cartUtils'; // Ensure you import this utility

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State to hold cart item count
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // State to control the modal visibility
  const router = useRouter();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      closeCartModal();
    };

    router.events.on('routeChangeStart', handleRouteChange);

    // Cleanup the event listener on component unmount
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  const updateCartItemCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(itemCount);
  };

  // Effect to update cart item count from localStorage
  useEffect(() => {
    updateCartItemCount();

    // Add event listener for custom cart update event
    window.addEventListener('cartUpdated', updateCartItemCount);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('cartUpdated', updateCartItemCount);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.hamburger} onClick={toggleNavbar}>
        &#9776;
      </div>
      <ul className={`${styles.navList} ${isOpen ? styles.open : ''}`}>
        <li className={styles.navItem}><Link href="/"><a className={styles.navLink}>Home</a></Link></li>
        <li className={styles.navItem}><Link href="/shop"><a className={styles.navLink}>Shop</a></Link></li>
        <li className={styles.navItem}><Link href="/cart"><a className={styles.navLink}>Cart</a></Link></li>
        <li className={styles.navItem}><Link href="/checkout"><a className={styles.navLink}>Checkout</a></Link></li>
      </ul>
      <div className={styles.cartIconContainer} onClick={toggleCartModal}>
        <FaShoppingCart className={styles.cartIcon} />
        {cartItemCount > 0 && (
          <span className={styles.cartBadge}>{cartItemCount}</span>
        )}
      </div>
      <CartModal isOpen={isCartModalOpen} onClose={closeCartModal} />
    </nav>
  );
};

export default Navbar;
