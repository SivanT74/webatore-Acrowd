import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/SlugPage.module.css'; // Ensure correct path
import { fetchProducts, fetchProductBySlug, fetchRelatedProducts } from '../api/fetchProducts';
import ImageComponent from '../api/ImageComponent'; // Adjust the path as necessary
import { dispatchCartUpdateEvent } from '../../components/cartUtils'; // Import the utility function

export async function getStaticPaths() {
  const products = await fetchProducts();
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const product = await fetchProductBySlug(slug);

  const relatedProducts = await fetchRelatedProducts(product.categories[0].id, product.id);

  return {
    props: {
      product,
      relatedProducts,
    },
    revalidate: 10,
  };
}

const ProductPage = ({ product, relatedProducts }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1); // sets quantity to 1
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // makes the 1st img in list appear first
  const [strippedDescription, setStrippedDescription] = useState("");

  useEffect(() => {
    // removes <p> tags from description
    const stripHtmlTags = (html) => {
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    setStrippedDescription(stripHtmlTags(product.short_description));
  }, [product]);

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
        quantity: quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart');
    dispatchCartUpdateEvent(); // Dispatch custom event
  };

  // image button
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  // sets breadcrumbs
  const breadcrumb = `Shop / ${product.categories.map(cat => cat.name).join(' / ')}`;

  return (
    <div className={styles.productPage}>
      <Head>
      <title>{`View details of ${product.name} - Our Shop`}</title>
      <meta name="description" content={`View details of ${product.name}. Add to cart and explore related products.`} />

      <meta property="og:url" content={`https://webstore-acrowd.vercel.app/product/${product.slug}`} />
      <meta property="og:type" content="product" />
      <meta property="og:title" content={`Buy ${product.name} - Our Shop`} />
      <meta property="og:description" content={`View details of ${product.name}. Add to cart and explore related products.`} />
      <meta property="og:image" content={product.images[0]?.src} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="webstore-acrowd.vercel.app" />
      <meta property="twitter:url" content={`https://webstore-acrowd.vercel.app/product/${product.slug}`} />
      <meta name="twitter:title" content={`Buy ${product.name} - Our Shop`} />
      <meta name="twitter:description" content={`View details of ${product.name}. Add to cart and explore related products.`} />
      <meta name="twitter:image" content={product.images[0]?.src} />
      <meta name="twitter:image" content="https://ogcdn.net/c078a98b-9a33-4eaf-a5cf-e5ebf3ea450c/v1/webstore-acrowd.vercel.app/Welcome%20to%20Our%20Shop/Discover%20our%20wide%20range%20of%20products%20and%20amazing%20deals.%20Shop%20now%20at%20our%20online%20store./{product.images[0]?.src}/og.png" />
      </Head>
      <button className={styles.backButton} onClick={() => router.push('/')}>{'<'}</button>
      <div className={styles.productDetail}>
        <div className={styles.leftSide}>
          <div className={styles.imageContainer}>
            {product.images && product.images.length > 0 && (
              <>
                {product.images[currentImageIndex] && (
                  <img src={product.images[currentImageIndex].src} alt={product.name} />
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
          <p>{strippedDescription}</p>
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
                  <ImageComponent
                    src={relatedProduct.images[0]?.src}
                    alt={relatedProduct.name}
                    style={{ width: '100px', height: '100px' }} // Apply styles for related products
                  />
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
