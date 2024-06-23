import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/SlugPage.module.css'; // Ensure correct path
import { fetchProductBySlug, fetchRelatedProducts } from '../api/fetchProducts';
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
                  <ImageComponent
                    src={relatedProduct.images[0]?.src}
                    alt={relatedProduct.name}
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
