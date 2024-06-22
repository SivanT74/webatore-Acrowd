import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './style/CartModal.module.css';
import { dispatchCartUpdateEvent } from './cartUtils'; // Ensure you import this utility

const CartModal = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
    }
  }, [isOpen]);

  const handleRemove = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatchCartUpdateEvent(); // Dispatch custom event
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item => item.id === productId ? { ...item, quantity } : item);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    dispatchCartUpdateEvent(); // Dispatch custom event
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div>
      <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}></div>
      <div className={`${styles.cartModal} ${isOpen ? styles.open : ''}`}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <h2 className={styles.modalTitle}>Your Cart</h2>
          {cart.length === 0 ? (
            <p className={styles.emptyCartText}>Your cart is empty</p>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cart.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.cartItemImage}>
                      <Link href={`/product/${item.slug}`}>
                        <a>
                          <img src={item.image} alt={item.name} />
                        </a>
                      </Link>
                    </div>
                    <div className={styles.cartItemDetails}>
                      <div className={styles.quantitySelector}>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className={styles.cartItemPrice}>
                        ${ (item.price * item.quantity).toFixed(2) }
                      </div>
                    </div>
                    <div className={styles.cartItemRemove}>
                      <button onClick={() => handleRemove(item.id)}>×</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.total}>Total: ${calculateTotal()}</div>
              <Link href="/cart">
                <a className={styles.checkoutButton} onClick={onClose}>Go to Cart</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
