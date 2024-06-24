// fetchProducts.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const apiUrl = process.env.API_URL;

export const fetchProducts = async (category = null, subcategory = null) => {
  try {
    const response = await axios.get(apiUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      params: {
        per_page: 20,
        fields: 'id,name,price,sale_price,regular_price,images,slug,categories',
      },
    });

    let products = response.data;

    if (category) {
      products = products.filter(product =>
        product.categories.some(cat => cat.name.toLowerCase() === category.toLowerCase())
      );
    }

    if (subcategory) {
      products = products.filter(product =>
        product.categories.some(cat => cat.name.toLowerCase() === subcategory.toLowerCase())
      );
    }

    return products.filter(product => product.images && product.images.length > 0);
  } catch (error) {
    throw new Error('Failed to fetch products: ' + error.message);
  }
};

export const fetchProductBySlug = async (slug) => {
  try {
    const response = await axios.get(apiUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      params: {
        slug,
      },
    });

    if (response.data.length === 0) {
      throw new Error('Product not found');
    }

    return response.data[0];
  } catch (error) {
    throw new Error('Failed to fetch product: ' + error.message);
  }
};

export const fetchRelatedProducts = async (categoryId, currentProductId) => {
  try {
    const response = await axios.get(apiUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      params: {
        category: categoryId,
        per_page: 5,
      },
    });

    return response.data.filter(product => product.id !== currentProductId);
  } catch (error) {
    throw new Error('Failed to fetch related products: ' + error.message);
  }
};

export const fetchCart = async (cart) => {
  try {
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { cart, total: cartTotal.toFixed(2) };
  } catch (error) {
    throw new Error('Failed to fetch cart data: ' + error.message);
  }
};

// New function to submit the order
export const submitOrder = async (orderData) => {
  try {
    const response = await axios.post('https://shop-interview.acrowd.se/wp-json/wc/v3/orders', orderData, {
      auth: {
        username: consumerKey,
        password: consumerSecret
      }
    });

    if (response.status !== 201) {
      throw new Error('There was an issue with your order.');
    }

    return response.data;
  } catch (error) {
    throw new Error('Failed to submit order: ' + error.message);
  }
};
