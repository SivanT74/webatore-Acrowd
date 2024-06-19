import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/SlugPage.module.css'; // Ensure correct path

const ProductPage = () => {
  const [product, setProduct] = useState(null); // makes product start as null
  const [relatedProducts, setRelatedProducts] = useState([]); // for related products
  const [loading, setLoading] = useState(true); // loading
  const [error, setError] = useState(null); // for if error
  const [quantity, setQuantity] = useState(1); // sets quantity to 1
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // makes the 1st img in list appear first
  const router = useRouter(); // navigation
  const { slug } = router.query; // unique slug navigation

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => { // makes connection
      try {
        const consumerKey = 'ck_4c0d8a4f83c78831c200e39d1f371e92d419d863';
        const consumerSecret = 'cs_1eb6c96b9a32942b52a868da3ad28698b15873ff';
        const apiUrl = `https://shop-interview.acrowd.se/wp-json/wc/v3/products?slug=${slug}`;

        const response = await axios.get(apiUrl, {
          auth: {
            username: consumerKey,
            password: consumerSecret,
          },
        });

        // if we get data
        if (response.data.length > 0) { 
          const productData = response.data[0];
          setProduct(productData);
          setCurrentImageIndex(0); // Reset currentImageIndex whenever a new product is loaded

          const mainCategoryId = productData.categories[0].id; // Get the main category ID
          fetchRelatedProducts(mainCategoryId, productData); // Fetch related products based on the main category ID
        } else {
          setError('Product not found');
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    // gets related products
    const fetchRelatedProducts = async (categoryId, currentProduct) => {
      try {
        const consumerKey = 'ck_4c0d8a4f83c78831c200e39d1f371e92d419d863';
        const consumerSecret = 'cs_1eb6c96b9a32942b52a868da3ad28698b15873ff';
        const apiUrl = `https://shop-interview.acrowd.se/wp-json/wc/v3/products`;

        const response = await axios.get(apiUrl, {
          auth: {
            username: consumerKey,
            password: consumerSecret,
          },
          params: {
            category: categoryId,
            per_page: 5, // Adjust the number of related products to display
          },
        });

        // Filter out the current product from the related products list
        const filteredProducts = response.data.filter(product => product.id !== currentProduct.id);

        setRelatedProducts(filteredProducts);
      } catch (error) {
        setError(error);
      }
    };

    fetchProduct();
  }, [slug]);

  // handles quantity change
  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + change;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  // add to local storage
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemInCart = cart.find(item => item.id === product.id);

    if (itemInCart) {
      itemInCart.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.src,
        price: parseFloat(product.price), // Ensure price is a number
        quantity: quantity
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart');
  };

  // image button
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // sets breadcrumbs
  const breadcrumb = `Shop / ${product.categories.map(cat => cat.name).join(' / ')}`;

  // removes <p> tags from description
  const stripHtmlTags = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className={styles.productPage}>
      <Head>
        <title>{product.name} - Your Shopping Cart</title>
        <meta name="description" content={`View details of ${product.name}. Add to cart and explore related products.`} />
      </Head>
      <button className={styles.backButton} onClick={() => router.push('/')}>{'<'}</button>
      <div className={styles.productDetail}>
        <div className={styles.leftSide}>
          <div className={styles.imageContainer}>
            {product.images && product.images.length > 0 && (
              <>
                {product.images[currentImageIndex] && (
                  <Image width={150} height={150} src={product.images[currentImageIndex].src} alt={product.name} />
                )}
                {product.images.length > 1 && (
                  <>
                    <button onClick={handlePreviousImage} className={styles.prevButton}>{"<"}</button>
                    <button onClick={handleNextImage} className={styles.nextButton}>{">"}</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles.productInfo}>
          <p className={styles.breadcrumb}>{breadcrumb}</p>
          <h2 className={styles.productName}>{product.name}</h2>
          <div className={styles.price}>
            {product.sale_price ? (
              <>
                <span className={styles.regularPrice}>${product.regular_price}</span>
                <span className={styles.salePrice}>${product.sale_price}</span>
              </>
            ) : (
              <span>${product.price}</span>
            )}
          </div>
          <p>{stripHtmlTags(product.short_description)}</p>
          <div className={styles.addToCartContainer}>
            <div className={styles.quantitySelector}>
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <button className={styles.addToCartButton} onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
      <div className={styles.relatedProductsSection}>
        <p className={styles.relatedProductsTitle}>Related Products</p>
        <div className={styles.relatedProducts}>
          {relatedProducts.map((relatedProduct) => (
            <div key={relatedProduct.id} className={styles.relatedProductItem}>
              <Link href={`/product/${relatedProduct.slug}`}>
                <a>
                  <Image width={150} height={150} src={relatedProduct.images[0]?.src} alt={relatedProduct.name} />
                  <p className={styles.relatedProductName}>{relatedProduct.name}</p>
                  <p className={styles.relatedProductPrice}>
                    {relatedProduct.sale_price ? (
                      <>
                        <span className={styles.regularPrice}>${relatedProduct.regular_price}</span>
                        <span className={styles.salePrice}>${relatedProduct.sale_price}</span>
                      </>
                    ) : (
                      <span>${relatedProduct.price}</span>
                    )}
                  </p>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// makes easy to import
export default ProductPage;
