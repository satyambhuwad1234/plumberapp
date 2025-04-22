import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import axios from 'axios';
import AdminFooter from './AdminFooter';
import { IoCartOutline } from "react-icons/io5";
import { GrGroup } from "react-icons/gr";
import { BiGroup } from "react-icons/bi";
import Chart from './Chart';
import MonthlyReportChart from './MonthlyReportChart';


const Dashboard = () => {


    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        completedOrders:0,
        inProcessOrders: 0,
        canceledOrders: 0,
        pendingOrders: 0,
        totalCustomers:0,
        totalServicePartner:0,
        totalAmount:0,
        completedAmount:0,
        inProcessAmount:0,
        pendingAmount:0,
        canceledAmount:0,
      });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchDashboardData = async () => {
          try {
            const response = await axios.get("http://localhost:5000/api/dashboard-data");
            setDashboardData(response.data);
          } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setError("Failed to fetch dashboard data.");
          } finally {
            setLoading(false);
          }
        };
    
        fetchDashboardData();
      }, []);
    
      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error}</p>;




  return (
    <div>
      <div className="container-fluid">
        <AdminHeader/>
        <div className="main-content">
           <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="breadcrumb-wrap mb-g bg-red-gradient">
                        <div className="row align-items-center">
                            <div className="col-sm-12">
                                <h2>Dashboard</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-xl-4 col-lg-4 col-sm-6">
                            <div className="dashboard-box bg-white mb-g">
                                <div className="part-icon">
                                    <IoCartOutline />
                                    <h2>₹{dashboardData.totalAmount.toFixed(2)}</h2>
                                </div>
                                <div className="part-txt">
                                    <p><span>Total</span> Orders</p>
                                    <h3>{dashboardData.totalOrders}</h3>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-sm-6">
                            <div className="dashboard-box bg-white mb-g">
                                <div className="part-icon">
                                    <GrGroup />
                                </div>
                                <div className="part-txt">
                                    <p>Service Partners</p>
                                    <h3>{dashboardData.totalServicePartner}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-sm-6">
                            <div className="dashboard-box bg-white mb-g">
                                <div className="part-icon">
                                <BiGroup />
                                </div> 
                                <div className="part-txt">
                                    <p>Customers</p>
                                    <h3>{dashboardData.totalCustomers}</h3>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="breadcrumb-wrap">
                    <div className="top-box">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-sm-6">
                        <div className="single-box bg-success mb-g">
                            <div className="part-txt">
                            <p><span>Completed</span> Orders</p>
                            <h3>{dashboardData.completedOrders}</h3>
                            </div>
                            <div className="part-icon">
                                <h2>
                                ₹{dashboardData.completedAmount.toFixed(2)}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-sm-6">
                        <div className="single-box bg-warning mb-g">
                            <div className="part-txt">
                                <p><span>In Process</span> Orders</p>
                                <h3>{dashboardData.inProcessOrders}</h3>
                            </div>
                            <div className="part-icon">
                                <h2>
                                ₹{dashboardData.inProcessAmount.toFixed(2)}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-sm-6">
                        <div className="single-box bg-danger mb-g">
                            <div className="part-txt">
                                <p><span>Canceled</span> Orders</p>
                                <h3>{dashboardData.canceledOrders}</h3>
                            </div>
                            <div className="part-icon">
                                <h2>
                                ₹{dashboardData.canceledAmount.toFixed(2)}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-sm-6">
                        <div className="single-box bg-info mb-g">
                            
                            <div className="part-txt">
                                <p><span>Pending</span> Orders</p>
                                <h3>{dashboardData.pendingOrders}</h3>
                            </div>
                            <div className="part-icon">
                                <h2>
                                ₹{dashboardData.pendingAmount.toFixed(2)}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-5">
                    <div className="bg-white mt-g">
                        <Chart data={dashboardData} />
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="bg-white mt-g">
                        <MonthlyReportChart />
                    </div>
                </div>
            </div>

            



        </div>

      </div>

      <AdminFooter />

    </div>
  )
}

export default Dashboard