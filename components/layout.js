import Navbar from './navbar';

// laysout every page so navbar on top of page content
const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
export default Layout;
