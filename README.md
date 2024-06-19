# Interview Test - Ecommerce

## Hello!  👋 

This is a Next.js boilerplate project used as an interview test by [Acrowd](https://acrowd.se). The goal is to test your ability to follow instructions in a simulated "real world project". You will have access to a basic design that must be followed, the store will connect to a [WooCommerce](https://woocommerce.com/) instance with some sample products. In the end, you will have created a simple ecommerce platform based on Next.js.

The project should be treated as a real project so any best practices that can be applies should be!

---

## Resources

- [The Figma Design](https://www.figma.com/file/z7jZJGxVyjScHaNlVVlh6d/Shop-Interview?node-id=0%3A1) - Figma can be used in the browser or downloaded.
    - An account can be created to allow for more advanced inspection of sizes, colors and fonts.
- [WooCommerce API Documentation](https://woocommerce.github.io/woocommerce-rest-api-docs) - Use the config below:
    - Wordpress base URL: `https://shop-interview.acrowd.se`
    - WooCommerce Consumer Key: `ck_4c0d8a4f83c78831c200e39d1f371e92d419d863`
    - WooCommerce Consumer Secret: `cs_1eb6c96b9a32942b52a868da3ad28698b15873ff`
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Wordpress/WooCommerce login](https://shop-interview.acrowd.se/wp-admin) - No changes must be made, login is allowed to validate conneciton.
    - Username: `acrowd`
    - Password: `$P$BBFSHDQjE4AXKQUfI`

----

## Specification

You are to build an e-commerce platform based on the provided design. The store must fetch data from the provided WooCommerce instance. The following functions are required:

- Load and display products
    - Categorize products with a router and allow for nested categories, eg. `/shop/women/hoodies`
    - Once in a category, the title should change and the sub categories will be displayed
- Display single products using a route like `/product/{product-slug}`
    - A breadcrumb that displays the products parent categories, eg. `Shop / Women / Hoodies`
    - Pricing that allows for "sales"
    - List of featured products
- A cart that allows the following: `adding`, `removal` and `change in quantity`
    - The cart route should be `/cart`
- A mock checkout that contains the required fields and once submitted creates an order in WooCommerce
    - The checkout route should be `/checkout`

<br>

There are no requirements on how you structure the project or which (if any) packages you use. But as in any project readability, scalability and best practices are all areas in where we strive to improve ourselves.

<br>

### Optional functions

These functions in no particular order are optional but will really increase the value of the project:

- Add a basic menu bar for easier navigation
- Make sure that everything is as SEO friendly as possible
- Optimize for Google Lighthouse scores
- Allow for an image gallery on the product page instead of a single image
- Change product route to include categories, eg. `/shop/women/hoodies/{product-slug}`
- Secure the WooCommerce requests with a Next.js API endpoint to not expose the keys
- Adjust design to fit mobile displays

---

## Delivery

Clone this repo and once the project is completed, push the changes and send your repo URL to your contact person at Acrowd. For any questions about the project that's not specified here, don't hesitate to contact us!
