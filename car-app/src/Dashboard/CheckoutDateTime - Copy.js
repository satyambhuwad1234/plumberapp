import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminHeader from './AdminHeader'

const CheckoutDateTime = () => {

    const [datetimes, setDatetimes] = useState([]);

    useEffect(() => {
        const fetchDatetimes = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/datetime");
                setDatetimes(response.data);
            } catch (error) {
                alert("Error fetching datetimes");
                console.error(error);
            }
        };
        fetchDatetimes();
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
                                    <h2>Date & Time</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 col-lg-12">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className="bg-dark text-white">Sr. No.</th>
                                        <th className="bg-dark text-white">Date</th>
                                        <th className="bg-dark text-white">Time</th>
                                        <th className="bg-dark text-white">User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                    {datetimes.length > 0 ? (
                        datetimes.map((datetimes, index) => (
                            <tr key={datetimes._id}>
                                <td>{index + 1}</td>
                                <td>{datetimes.date}</td>
                                <td>{datetimes.time}</td> 
                                <td>{datetimes.userId?.name || "Anonymous"}</td>
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

export default CheckoutDateTime