// /pages/api/fetchProducts.js
import axios from 'axios';

const consumerKey = 'ck_4c0d8a4f83c78831c200e39d1f371e92d419d863'; 
const consumerSecret = 'cs_1eb6c96b9a32942b52a868da3ad28698b15873ff'; 
const apiUrl = 'https://shop-interview.acrowd.se/wp-json/wc/v3/products';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(apiUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
      params: {
        per_page: 20,
        fields: 'id,name,price,sale_price,regular_price,images,slug', // specify the relevant fields
      },
    });

    const allProducts = response.data;
    const productsWithImages = allProducts.filter(product => product.images && product.images.length > 0);
    return productsWithImages;
  } catch (error) {
    throw new Error('Failed to fetch products: ' + error.message);
  }
};
