import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import Cart from './Pages/Cart';
import AdminHeader from './Dashboard/AdminHeader';
import Dashboard from './Dashboard/Dashboard';
import AddBanner from './Dashboard/AddBanner';
import Home from './Pages/Home';
import AddCategory from './Dashboard/AddCategory';
import CategoryPage from './Pages/CategoryPage';
import ProductDetails from './Dashboard/ProductDetails';
import CartDetails from './Dashboard/CartDetails';
import Checkout from './Pages/Checkout';
import CheckoutDateTime from './Dashboard/CheckoutDateTime';
import CheckoutAddress from './Dashboard/CheckoutAddress';
import EditAddress from './Pages/EditAddress';
import MyBooking from './Pages/MyBooking';
import AdminLogin from './Dashboard/AdminLogin';
import AdminRegister from './Dashboard/AdminRegister';
import AdminFooter from './Dashboard/AdminFooter';
import AdminDashboard from './Dashboard/AdminDashboard';
import AdminUsers from './Dashboard/AdminUsers';
import AdminUserProfile from './Dashboard/AdminUserProfile';
import ServicePartners from './Dashboard/ServicePartners';
import ProtectedRoute from './Dashboard/ProtectedRoute';
import Thankyou from './PartnerPage/Thankyou';
import Partnerpage from './PartnerPage/Partnerpage';
import PartnerHeader from './PartnerPage/PartnerHeader';
import PartnerDetails from './Dashboard/PartnerDetails';
import PartnerDetailPage from './Dashboard/PartnerDetailPage';
import Payment from './Pages/Payment';
import CheckoutDetails from './Dashboard/CheckoutDetails';
import AdminPayment from './Dashboard/AdminPayment';
import Orderdetails from './Dashboard/Orderdetails';
import BookingAllsummary from './Dashboard/BookingAllsummary';
import AreaSearch from './Pages/AreaSearch';
import VerifyBooking from './Pages/VerifyBooking';
import BookingSummaryDetails from './Dashboard/BookingSummaryDetails';



function App() {

  return (
    <div className="App">
      <Router>

      
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/dashboard" element={<Dashboard/>} /> */}
          <Route path="/adminheader" element={<AdminHeader/>} />
          <Route path="/addbanner" element={<AddBanner/> } />
          <Route path="/addcategory" element={<AddCategory/>} />
          <Route path='/' element={<Home/>}  />
          <Route path="/category/:categoryTitle" element={<CategoryPage/>} />
          <Route path="/productdetails" element={<ProductDetails/>} />
          <Route path="/cartdetails" element={<CartDetails/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/checkoutdatetime" element={<CheckoutDateTime/>} />
          <Route path="/checkoutaddress" element={<CheckoutAddress/>} />
          <Route path="/editaddress" element={<EditAddress/>} />
          <Route path="/bookings" element={<MyBooking/>} />
          <Route path="/adminlogin" element={<AdminLogin/>} />
          <Route path="/adminregister" element={<AdminRegister/>} />
          <Route path='/adminfooter' element={<AdminFooter />} />
          <Route path='/admin-dashboard' element={<AdminDashboard/>} />
          <Route path='/adminusers' element={<AdminUsers />} />
          <Route path='/adminusers/:id' element={<AdminUserProfile />} />
          <Route path='/servicepartners' element={<ServicePartners />} />
          <Route path='/thankyou' element={<Thankyou />} />
          <Route path='/partnerpage' element={<Partnerpage />} />
          <Route path='partnergeader' element={<PartnerHeader />} />
          <Route path="partnerdetails" element={<PartnerDetails />} />
          <Route path='/servicepartner/:id' element={<PartnerDetailPage />} />
          <Route path='/payment' element={<Payment />} />
          <Route path="/checkoutdetails" element={<CheckoutDetails />} /> 
          <Route path="/bookingdetails" element={<AdminPayment />} />
          <Route path="/order-details/:id" element={<Orderdetails/>} />
          <Route path="/booking-summary" element={<BookingAllsummary />} />
          <Route path="/areasearch" element={<AreaSearch />} />
          <Route path="/verify-booking/:orderId" element={<VerifyBooking />} />
          <Route path="/bookingSummarydetails/:id" element={<BookingSummaryDetails />} />


        </Routes>
        <Routes>
                <Route path="/adminlogin" element={<AdminLogin />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                       
                    }
                />
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
      </Router>


    </div>
  );
}

export default App;
