import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminHeader from './AdminHeader'

const CheckoutAddress = () => {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/address");
                setAddresses(response.data);
            } catch (error) {
                alert("Error fetching addresses");
                console.error(error);
            }
        };
        fetchAddresses();
    }, []);

  return (
    <div>
        <div className="container-fluid">
            <AdminHeader/>
            <div className="main-content">
            <div className="row">
                    <div className="col-xl-12 col-lg-12">
                        <div className="breadcrumb-wrap mb-g">
                            <div className="row align-items-center">
                                <div className="col-sm-12">
                                    <h2>Address</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-rsponsive">
                        <table className="table table-bordered">
                <thead>
                    <tr>
                        <th className="bg-dark text-white">#</th>
                        <th className="bg-dark text-white">Full Name</th>
                        <th className="bg-dark text-white">House / Company</th>
                        <th className="bg-dark text-white">Town/City</th>
                        <th className="bg-dark text-white">Country</th>
                        <th className="bg-dark text-white">Pincode</th>
                    </tr>
                </thead>
                <tbody>
                    {addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <tr key={address._id}>
                                <td>{index + 1}</td>
                                <td>{address.fname}</td>
                                <td>{address.house}</td>
                                <td>{address.town}</td>
                                <td>{address.country}</td>
                                <td>{address.pincode}</td> 
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No addresses found</td>
                        </tr>
                    )}
                </tbody>
            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CheckoutAddress