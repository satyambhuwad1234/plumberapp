import React, { useEffect, useState } from 'react';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import { useNavigate } from "react-router-dom";

const CheckoutDetails = () => {

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [processingOrders, setProcessingOrders] = useState({}); // Track which orders are being processed
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/payments");
        setPayments(response.data);
        setFilteredPayments(response.data); // Set initial filtered data
      } catch (error) {
        console.error("Error fetching payment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const handlePendingClick = async (orderId) => {
    try {
      // Find the payment details for the clicked order
      const bookingData = payments.find(payment => payment.orderId === orderId);
      if (!bookingData) {
        toast.error("No booking data found for this order.");
        return;
      }

      // Set processing state to disable the button
      setProcessingOrders(prevState => ({ ...prevState, [orderId]: true }));

      // Call API to save booking summary & send OTP
      const response = await axios.post("http://localhost:5000/api/save-booking-summary", bookingData);

      if (response.status === 200) {
        toast.success("Booking summary saved successfully and OTP sent.");

        // API Call to update the order status in the database
        await axios.post("http://localhost:5000/api/update-order-status", { orderId });

        // Update visitingStatus in local state
        setPayments(prevPayments =>
          prevPayments.map(payment =>
            payment.orderId === orderId ? { ...payment, visitingStatus: "In Process" } : payment
          )
        );

        // Navigate after all updates are done
        navigate("/booking-summary", { state: { bookingDetails: bookingData } });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed: ${error.message || error}`);
    } finally {
      // If you want to re-enable the button after processing, set it to false
      setProcessingOrders(prevState => ({ ...prevState, [orderId]: false }));
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = payments.filter((payment) =>
      payment.visitingStatus.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredPayments(filtered);
    setCurrentPage(1); // Optionally reset to page 1 after a new search
  };

  // Dynamically calculate pagination options
  const calculatePaginationOptions = () => {
    const totalRows = filteredPayments.length;
    const options = [5, 10, 20];
    if (totalRows > 20) options.push(totalRows); // Add total rows as a pagination option if more than 20
    return options;
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = rowsPerPage === "all" 
    ? filteredPayments 
    : filteredPayments.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = rowsPerPage === "all" 
    ? 1 
    : Math.ceil(filteredPayments.length / rowsPerPage);

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    const value = e.target.value === "all" ? "all" : parseInt(e.target.value);
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to the first page
  };

  // Define DataTable columns
  const columns = [
    {
      name: 'Sr. No',
      cell: (row, index) => {
        const effectiveRowsPerPage =
          rowsPerPage === 'all' ? filteredPayments.length : rowsPerPage;
        return (currentPage - 1) * effectiveRowsPerPage + index + 1;
      },
      sortable: false,
    },
    {
      name: 'Order ID',
      selector: (row) => row.orderId,
      sortable: true,
    },
    {
      name: 'User ID',
      selector: (row) => row.userId,
      sortable: true,
    },
    {
      name: 'Customer Name',
      cell: (row) => row.address.map(item => item.fname).join(', ')
    },
    {
      name: 'Customer Mobile No',
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: 'Product Name',
      cell: (row) =>
        row.cartItems && row.cartItems.length > 0 ? (
          row.cartItems.map((item, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.productName}
              style={{
                width: "auto",
                height: "50px",
                objectFit: "contain",
                display: "block",
                margin: "0px auto",
                borderRadius: "0px",
              }}
            />
          ))
        ) : (
          <span>No Image</span>
        ),
    },
    {
      name: 'Total Amount',
      selector: (row) => row.totalAmount,
      sortable: true,
    },
    {
      name: 'Product Quantity',
      cell: (row) => row.cartItems.map(item => item.quantity).join(', ')
    },
    {
      name: 'Visiting Date & Time',
      cell: (row) =>
        row.datetime
          .map(item => `${item.date}${item.time ? ' ' + item.time : ''}`)
          .join(', ')
    },
    {
      name: 'Visiting Address',
      cell: (row) =>
        row.address
          .map(item => `${item.house}${item.town ? ' ' + item.town : ''}${item.country ? ' ' + item.country : ''}${item.pincode ? ' ' + item.pincode : ''}`)
          .join(', ')
    },
    {
      name: 'Payment Method',
      selector: (row) => row.paymentMethod,
      sortable: true,
    },
    {
      name: 'Payment Status',
      selector: (row) => row.paymentStatus,
      sortable: true,
    },
    {
      name: 'Visiting Status',
      selector: (row) => row.visitingStatus,
      sortable: true,
    },
    {
      name: 'Created Date',
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
        <div style={{display:"flex", gap:"10px"}}>
        <a className="btn btn-info" href="#" onClick={() => handleViewDetails(row._id)}>View</a>
        
          <button
            className="btn btn-warning border-0"
            disabled={["Canceled", "In Process", "Completed"].includes(row.visitingStatus) || processingOrders[row.orderId]}
            style={{
              backgroundColor:
                row.visitingStatus === "Completed"
                  ? "green"
                  : ["Canceled"].includes(row.visitingStatus) || processingOrders[row.orderId]
                  ? "grey"
                  : ["In Process"].includes(row.visitingStatus) || processingOrders[row.orderId]
                  ? "orange"
                  : "blue",
              color: "white",
              cursor:
                ["Canceled", "In Process", "Completed"].includes(row.visitingStatus) || processingOrders[row.orderId]
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={() => handlePendingClick(row.orderId)}
          >
            {row.visitingStatus === "Completed"
              ? "Completed"
              : row.visitingStatus === "Canceled" || processingOrders[row.orderId]
              ? "Canceled"
              : row.visitingStatus === "In Process" || processingOrders[row.orderId]
              ? "In Process"
              : "Pending"}
          </button>
          </div>
        </>
      ),
    },
  ];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <a
            className="page-link"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };


  return (
    <div>

<div className="main-content">
        <div className="container-fluid">
          <AdminHeader/>

          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="breadcrumb-wrap mb-g bg-red-gradient">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="dashboard-title">
                      <h2>Booking Details</h2>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer /> 
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col-md-8">
                <div className="total-record">
                  <p>Total Records: <span>{filteredPayments.length}</span></p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Products..."
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="table-area">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    {columns.map((col, index) => (
                      <th className="bg-dark text-white" key={index}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((row) => (
                    <tr key={row._id}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex}>
                          {col.cell ? col.cell(row) : col.selector(row)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="area-pagination">
              <p>
                Display
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="form-select d-inline-block w-auto mx-2"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value="all">All</option>
                </select>
                Products
              </p>
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link"
                      href="#!"
                      aria-label="Previous"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  {renderPageNumbers()}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <a
                      className="page-link"
                      href="#!"
                      aria-label="Next"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <AdminFooter/>

    </div>
  )
}

export default CheckoutDetails