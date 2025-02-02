import  { Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import CartList from './components/CartList.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Logout from './components/Logout.js';
import Nav from './components/Nav.js';
import User from './components/User.js';
import ProductFocus from './components/ProductFocus.js';
import OrderList from './components/OrderList.js';
import Checkout from './components/Checkout.js';

function App() {

  return (
    <div className='App'>
      <Nav />
      <Routes>
        <Route path="/home" element={ <Home /> } />
        <Route path="/home/:id" element={ <ProductFocus /> } />
        <Route path="/cart/:id" element={ <CartList /> } />
        <Route path="/auth/login" element={ <Login /> } />
        <Route path="/auth/register" element={ <Register /> } />
        <Route path="/auth/logout" element={ <Logout /> } />
        <Route path="/user/:userId" element={ <User /> } />
        <Route path='/orders/:userId' element={ <OrderList /> } />
        <Route path="/checkout" element={ <Checkout /> } />
      </Routes>
   </div>
  );
}

export default App;
