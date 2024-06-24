import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/CheckoutPage.module.css'; // Ensure correct path
import ImageComponent from './api/ImageComponent'; // Correct path
import { fetchCart } from './api/fetchProducts'; // Import the new function

const CheckoutPage = () => {
  const [cart, setCart] = useState([]); // gets cart
  const [formData, setFormData] = useState({ // gets/saves info 
    email: '',
    firstName: '',
    lastName: '',
  });
  const [total, setTotal] = useState(0);
  const router = useRouter(); // navigation

  useEffect(() => {
    const getCartData = async () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      try {
        const { cart, total } = await fetchCart(savedCart);
        setCart(cart);
        setTotal(total);
      } catch (error) {
        console.error('Error fetching cart data', error);
      }
    };

    getCartData();
  }, []);

  // manage changes in fields
  const handleChange = (e) => { 
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // manages the submit to store
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = { //sets billing/shipping/payment. Change in real case
      payment_method: "paypal",
      payment_method_title: "PayPal",
      set_paid: true,
      billing: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: "123 Main St",
        address_2: "",
        city: "Anytown",
        state: "CA",
        postcode: "12345",
        country: "US",
        email: formData.email,
        phone: "(555) 555-5555",
      },
      shipping: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_1: "123 Main St",
        address_2: "",
        city: "Anytown",
        state: "CA",
        postcode: "12345",
        country: "US",
      },
      line_items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    // sends order to acrowd shop
    try {
      const response = await axios.post('https://shop-interview.acrowd.se/wp-json/wc/v3/orders', orderData, {
        auth: {
          username: 'ck_4c0d8a4f83c78831c200e39d1f371e92d419d863',
          password: 'cs_1eb6c96b9a32942b52a868da3ad28698b15873ff'
        }
      });
      if (response.status === 201) {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        router.push('/');
      } else {
        alert('There was an issue with your order.');
      }
    } catch (error) {
      console.error('Error placing order', error);
      alert('There was an issue with your order.');
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <Head>
        <title>Checkout - Your Shopping Cart</title>
        <meta name="description" content="Complete your purchase by providing your information." />
        
        <meta property="og:url" content="https://webstore-acrowd.vercel.app/checkout" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Checkout - Your Shopping Cart" />
        <meta property="og:description" content="Complete your purchase by providing your information." />
        <meta property="og:image" content="/placeholder.webp" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="webstore-acrowd.vercel.app" />
        <meta property="twitter:url" content="https://webstore-acrowd.vercel.app/checkout" />
        <meta name="twitter:title" content="Checkout - Your Shopping Cart" />
        <meta name="twitter:description" content="Complete your purchase by providing your information." />
        <meta name="twitter:image" content="/placeholder.webp" />
      </Head>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
          <label>First name *</label>
          <input
            type="text"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
          <label>Last name *</label>
          <input
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.orderSummary}>
          <p>Product</p>
          <div className={styles.summaryItems}>
            {cart.map((item) => (
              <div key={item.id} className={styles.summaryItem}>
                <ImageComponent
                  src={item.image}
                  alt={item.name}
                  style={{ width: '50px', height: '50px', marginRight: '10px' }} // Apply styles for checkout product images
                />
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
        <button type="submit" className={styles.confirmButton}>Confirm Purchase</button>
      </form>
    </div>
  );
};

// makes page easy to import
export default CheckoutPage;
