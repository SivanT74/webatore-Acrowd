import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/cartPage.module.css'; // Ensure correct path
import ImageComponent from './api/ImageComponent'; // Adjust the path as necessary
import { dispatchCartUpdateEvent } from '../components/cartUtils'; // Import the utility function

const CartPage = () => {
  const [cart, setCart] = useState([]); // gets cart
  const router = useRouter(); // navigation

  useEffect(() => {
    // Fetch cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    // Ensure prices are numbers
    const cartWithNumericPrices = savedCart.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));
    setCart(cartWithNumericPrices);
  }, []);

  // manages item removal
  const handleRemove = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatchCartUpdateEvent(); // Dispatch custom event
  };

  // manages the amount of item
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item => item.id === productId ? { ...item, quantity } : item);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatchCartUpdateEvent(); // Dispatch custom event
  };

  // calculates total item
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const defaultImage = '/placeholder.webp';

  return (
    <div className={styles.cartPage}>
      <Head>
        <title>Cart - Your Shopping Cart</title>
        <meta name="description" content="View and manage the items in your shopping cart. Adjust quantities or remove items before proceeding to checkout." />
        
        <meta property="og:url" content="https://webstore-acrowd.vercel.app/cart" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cart - Your Shopping Cart" />
        <meta property="og:description" content="View and manage the items in your shopping cart. Adjust quantities or remove items before proceeding to checkout." />
        <meta property="og:image" content="/placeholder.webp" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="webstore-acrowd.vercel.app" />
        <meta property="twitter:url" content="https://webstore-acrowd.vercel.app/cart" />
        <meta name="twitter:title" content="Cart - Your Shopping Cart" />
        <meta name="twitter:description" content="View and manage the items in your shopping cart. Adjust quantities or remove items before proceeding to checkout." />
        <meta name="twitter:image" content="/placeholder.webp" />
      </Head>
      <button className={styles.backButton} onClick={() => router.push('/shop')}>{'<'}</button>
      <p className={styles.cartHeader}>Cart</p>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th colSpan="2" className={styles.cartHeaderLeft}>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id} className={styles.cartItem}>
                  <td className={styles.cartItemImage}>
                    <Link href={`/product/${item.slug}`}>
                      <a>
                        <ImageComponent
                          src={item.image}
                          alt={item.name}
                          style={{ width: '150px', height: '150px' }} // Apply styles for cart product images
                        />
                      </a>
                    </Link>
                  </td>
                  <td className={styles.cartItemName}>
                    <Link href={`/product/${item.slug}`}>
                      <a>{item.name}</a>
                    </Link>
                  </td>
                  <td className={styles.cartItemPrice}>${item.price.toFixed(2)}</td>
                  <td id={styles.cartItemQuantity}>
                    <div className={styles.quantity}>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td className={styles.cartItemTotal}>${(item.price * item.quantity).toFixed(2)}</td>
                  <td className={styles.cartItemRemove}>
                    <button onClick={() => handleRemove(item.id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.divider}></div>
          <div className={styles.cartSummary}>
            <p>Total: ${calculateTotal()}</p>
            <Link href="/checkout">
              <a className={styles.checkoutButton}>Proceed to Checkout</a>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

// makes easy to import
export default CartPage;
