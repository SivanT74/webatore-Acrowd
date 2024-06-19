import Layout from '../components/Layout';
import '../styles/globals.css';

// makes the layout consisten true out pages
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

// makes easy to import
export default MyApp;
