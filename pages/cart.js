import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/cartPage.module.css'; // Ensure correct path

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
  };

  // manages the amount of item
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item => item.id === productId ? { ...item, quantity } : item);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // calculates total item
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className={styles.cartPage}>
      <Head>
        <title>Cart - Your Shopping Cart</title>
        <meta name="description" content="View and manage the items in your shopping cart. Adjust quantities or remove items before proceeding to checkout." />
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
                        <Image width={150} height={150} src={item.image} alt={item.name} />
                      </a>
                    </Link>
                  </td>
                  <td className={styles.cartItemName}>
                    <Link href={`/product/${item.slug}`}>
                      <a>{item.name}</a>
                    </Link>
                  </td>
                  <td className={styles.cartItemPrice}>${item.price.toFixed(2)}</td>
                  <td idName={styles.cartItemQuantity}>
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
