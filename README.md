# E-commerce Portfolio Project

## Overview
This E-commerce portfolio project is built to demonstrate my proficiency with modern web technologies including:
- **JavaScript**
- **React**
- **Node.js**
- **Express**
- **Passport**
- **Tailwind CSS**
- **PostgreSQL**

The project is designed as a professional portfolio piece, showcasing a complete e-commerce experience from product browsing to order management.

## Project Structure
The application follows a VMC (View, Model, Controller) architecture, ensuring a clean separation of concerns and efficient route management.

## Features

### Home Page (`/home`)
- **Product Listing**: Displays all available products with key details such as an image, price, rating, and a short description preview.
- **Automatic Redirection**: Users are redirected to `/home` upon accessing the site.

### Product Details Page (`/home/:productId`)
- **Detailed View**: Clicking on a product displays a comprehensive page with:
  - Full product description
  - Complete rating statistics
  - Additional product details organized in a table
- **Interactive Options**:
  - **Buy**: Initiates a direct purchase.
  - **Add to Cart**: Adds the product to the shopping cart.
- **Quantity Selection**: Both actions allow users to specify the desired quantity.

### Shopping Cart (`/cart`)
- **Cart Overview**: Lists products added to the cart with options to edit quantities or remove items.
- **Purchase Option**: Provides the ability to purchase all items in the cart.

### Checkout Process
- **Payment Integration**: Utilizes Stripe for processing payments.
- **Test Environment**: Includes valid fake card details for testing the checkout functionality.
- **Post-Purchase Redirection**: After completing the checkout, users are redirected to the `/orders` page.

### Orders Page (`/orders`)
- **Order History**: Displays all orders with details such as product image, name, price, and purchase date.
- **Order Types**:
  - **Single Item Orders**: For direct purchases made from the product details page.
  - **Grouped Orders**: For purchases made via the shopping cart.
- **Order Management**: Allows users to remove orders from their history.

### User Profile (`/user`)
- **Profile Information**: Shows basic user details including username, email, and address.

### Authentication
- **Login/Register**: Users can authenticate using:
  - Google authentication
  - Traditional login and registration forms at `/login` and `/register`
- **Access Control**: Certain routes (e.g., `/user`) and actions (e.g., direct purchases, adding to cart) are restricted to authenticated users.
- **Logout**: Users can log out via `/logout` after clicking the logout button.

### Navigation Bar
- **Dynamic Options**:
  - **Unauthenticated Users**: See Home, Login, and Register options.
  - **Authenticated Users**: See Home, Cart, Orders, Profile, and Logout options.

## Usage
1. **Browse Products**: Navigate to `/home` to view all products.
2. **View Details**: Click on a product to access detailed information and available actions.
3. **Manage Cart**: Add products to your cart and view them at `/cart` where you can adjust quantities or remove items.
4. **Checkout**: Complete your purchase using Stripe, with provided fake card details for testing.
5. **Track Orders**: Review your order history on the `/orders` page.
6. **Manage Profile**: Update your user information at `/user`.
7. **Authentication**: Log in or register via Google or the standard forms to access restricted features.
