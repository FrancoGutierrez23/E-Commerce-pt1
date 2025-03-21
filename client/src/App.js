import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/Nav.js";
import Home from "./components/Home.js";
import CartList from "./components/CartList.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import Logout from "./components/Logout.js";
import Nav from "./components/Nav.js";
import User from "./components/User.js";
import ProductFocus from "./components/ProductFocus.js";
import OrderList from "./components/OrderList.js";
import Checkout from "./components/Checkout.js";
import PhoneNav from "./components/PhoneNav";
import useMediaQuery from "./components/customHooks.js";
import AuthCallback from "./components/AuthCallback.js";

function App() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <AuthProvider>
      {isMobile ? <PhoneNav /> : <Nav />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:id" element={<ProductFocus />} />
        <Route path="/cart/:id" element={<CartList />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/logout" element={<Logout />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/orders/:userId" element={<OrderList />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
