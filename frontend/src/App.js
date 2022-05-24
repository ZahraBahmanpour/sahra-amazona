import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './screens/homeScreen';
import ProductScreen from './screens/productScreen';
import CartScreen from './screens/cartScreen';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import NavDropDown from 'react-bootstrap/NavDropDown';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import SigninScreen from './screens/signinScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/shippingAddressScreen';
import SignupScreen from './screens/signupScreen';
import PaymentMethodScreen from './screens/paymentMethodScreen';
import PlaceOrderScreen from './screens/placeOrderScreen';
import OrderScreen from './screens/orderScreen';
import OrderHistoryScreen from './screens/orderHistoryScreen';
import ProfileScreen from './screens/profileScreen';
import { getError } from './utils/utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/searchScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };

  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sideBarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSideBarIsOpen(!sideBarIsOpen)}
              >
                <i className="fas fa-bars" />
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>Amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropDown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropDown.Item>Profile</NavDropDown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropDown.Item>Order History</NavDropDown.Item>
                      </LinkContainer>
                      <NavDropDown.Divider />
                      <Link
                        className="dropdown-item"
                        to="/signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropDown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sideBarIsOpen
              ? 'active-nav side-navbar d-flex justifycontent-between flex-wrap flex-column'
              : 'side-navbar d-flex justifycontent-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSideBarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeOrder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All Rights Reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
