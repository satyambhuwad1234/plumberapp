import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, navigate, useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    const navigate = useNavigate();

    // Logout function
  const handleLogout = () => {
    // Remove user role from localStorage
    localStorage.removeItem('userRole');
    
    // Redirect to login page
    navigate('/adminlogin'); // Assuming '/login' is your login route
  };
    
  return (
    <div>

    <div className="container-fluid">
         {/* header  */}
        <div className="header-admin">
            <div className="top-header">
                <div className="row justify-content-between">
                    <div className="col-xl-3 col-lg-4 col-sm-4 col-6">
                        <div className="d-flex align-items-center">
                            <div className="logo">
                                <div className="logo-big">
                                    <a href="index.html">
                                         <img src="assets/images/logo.png" id="logoBig" alt="Logo big" />
                                    </a>
                                </div>
                                <div className="logo-small">
                                    <a href="index.html">
                                        <img src="assets/images/logo.png" id="logoSmall" alt="Logo small" />
                                    </a>
                                </div>
                            </div>
                            <button className="sidebar-collapse">
                                <i className="bi bi-list"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-xl-9 col-lg-8 col-sm-8 col-6">
                        <div className="top-right">
                            <nav className="navbar navbar-expand">
                                <div className="navbar-collapse" id="navbarSupportedContent">
                                    {/* <form className="nav-form d-flex">
                                        <input type="search" placeholder="Search" aria-label="Search" />
                                        <button type="submit"><i className="bi bi-search"></i></button>
                                    </form> */}
                                    <ul className="navbar-nav ms-auto">
                                        <li className="nav-item dropdown">
                                            <button className="profile-dropdown" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                                                <img src="assets/images/avatar-1.jpg" alt="user" />
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton3">
                                                <li><a className="dropdown-item" href="#"><i className="bi bi-person-badge-fill"></i>profile</a></li>
                                                <li><a className="dropdown-item" href="#"><i className="bi bi-envelope-fill"></i>inbox</a></li>
                                                <li><a className="dropdown-item" href="#"><i className="bi bi-list-task"></i>tasks</a></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><a className="dropdown-item" href="#"><i className="bi bi-gear-fill"></i>settings</a></li>
                                                <li><a className="dropdown-item" href="#"><i className="bi bi-shield-lock-fill"></i>lock screen</a></li>
                                                <li><a className="dropdown-item" href="#"><i className="bi bi-box-arrow-right"></i>sign out</a></li>
                                            </ul>
                                        </li>
  
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        {/* header  */}

         {/* main sidebar  */}
        <div className="fixed-sidebar sidebar-mini" data-simplebar>
            <div className="menu">
                <div className="sidebar-menu">
                    <ul>
                        
                        <li className="sidebar-item">
                            <Link to="/dashboard" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="Dashboard" tabindex="0"><i className="bi bi-house-door-fill"></i> <span>Dashboard</span></Link>
                            </li>

                        <li className="sidebar-item has-sub">
                            <a role="button" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="Upload" tabindex="0"><i className="bi bi-box-arrow-up"></i> <span>Home</span></a>
                            <ul className="sub-menu">
                                <li><Link aria-current="page" to="/addbanner" className="sub-menu-item">Add Banner</Link></li>
                                <li><Link aria-current="page" to="/addcategory" className="sub-menu-item">Add Category</Link></li>
                                {/* <li><a href="#" className="sub-menu-item">Category</a></li> */}
                            </ul>
                        </li>

                        <li className="sidebar-item">
                            <Link to="/adminusers" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0" data-bs-original-title="Table">
                                <i className="bi bi-grid-1x2-fill"></i> <span>Admin Users</span>
                            </Link>
                        </li>

                        <li className="sidebar-item">
                            <Link className="sidebar-link" aria-current="page" to="/productdetails">
                                <i className="bi bi-grid-1x2-fill"></i> <span>Add Product</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/cartdetails" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0" data-bs-original-title="Table">
                                <i className="bi bi-grid-1x2-fill"></i> <span>Cart Details</span>
                            </Link>
                        </li>
                        
                        <li className="sidebar-item has-sub">
                            <a role="button" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0"><i className="bi bi-box-arrow-up"></i> <span>Checkout</span></a>
                            <ul className="sub-menu">
                                <li><Link aria-current="page" to="/checkoutdatetime" className="sub-menu-item">Date & Time</Link></li>
                                <li><Link aria-current="page" to="/checkoutaddress" className="sub-menu-item">Address</Link></li>
                                <li><Link aria-current="page" to="/checkoutdetails" className="sub-menu-item">Checkout Details</Link></li>
                                {/* <li><a href="#" className="sub-menu-item">Category</a></li> */}
                            </ul>
                        </li>

                        <li className="sidebar-item">
                            <Link to="/bookingdetails" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0" data-bs-original-title="Table">
                                <i className="bi bi-grid-1x2-fill"></i> <span>Booking Details</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/partnerdetails" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0" data-bs-original-title="Table">
                                <i className="bi bi-grid-1x2-fill"></i> <span>Services Partners</span>
                            </Link>
                        </li>

                        <li className="sidebar-item">
                            <Link to="/booking-summary" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0" data-bs-original-title="Table">
                                <i className="bi bi-grid-1x2-fill"></i> <span>Booking All Summary</span>
                            </Link>
                        </li>
                        
                        <li className="sidebar-item">
                            <a href="#" className="sidebar-link" data-bs-toggle="tooltip" data-bs-placement="right" title="" tabindex="0" data-bs-original-title="Table" onClick={handleLogout}>
                                <i className="bi bi-grid-1x2-fill"></i> <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* sidebar menu  */}
        </div>
        {/* main sidebar */}

    </div>


    </div>
  )
}

export default AdminHeader


