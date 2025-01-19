import  { Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import CartList from './components/CartList.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Nav from './components/Nav.js';
import User from './components/User.js';



function App() {
  return (
    <div className='App'>
      <Nav />
      <Routes>
        <Route path="/home" element={ <Home /> } />
        <Route path="/cart" element={ <CartList /> } />
        <Route path="/auth/login" element={ <Login /> } />
        <Route path="/auth/register" element={ <Register /> } />
        <Route path="/user" element={ <User /> } />
      </Routes>
   </div>
  );
}

export default App;
