import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const CartDetails = () => {
  const [cartDetails, setCartDetails] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredcartDetails, setFilteredcartDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page




  useEffect(() => {
    axios
      .get("http://localhost:5000/api/cart/details")
      .then((response) => {
        setCartDetails(response.data);
        setFilteredcartDetails(response.data); // Initially, show all CartDetails
      })
      .catch((error) => {
        console.error("Error fetching cart details:", error);
      });
  }, []);


  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = cartDetails.filter((cartDetails) => {
      const nameMatch = cartDetails.productName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
      const priceMatch = cartDetails.productPrice
        .toString()
        .includes(e.target.value);
      return nameMatch || priceMatch; // Match either product name or price
    });
    setFilteredcartDetails(filtered);
  };
  


   // Pagination Logic
   const indexOfLastRecord = currentPage * rowsPerPage;
   const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
   const currentRecords = rowsPerPage === "all" ? filteredcartDetails : filteredcartDetails.slice(indexOfFirstRecord, indexOfLastRecord);
 
   const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(filteredcartDetails.length / rowsPerPage);
 

 
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
          // Use all records if "all" is selected, otherwise calculate based on rowsPerPage
          const effectiveRowsPerPage =
            rowsPerPage === 'all' ? filteredcartDetails.length : rowsPerPage;
          return (currentPage - 1) * effectiveRowsPerPage + index + 1;
        },
        sortable: false,
      },
      {
        name: 'Product Name',
        selector: (row) => row.productName,
        sortable: true,
      },
      {
        name: 'Price',
        selector: (row) => row.productPrice,
        sortable: true,
      },
      {
        name: 'Sale Price',
        selector: (row) => row.productSalePrice,
        sortable: true,
      },
      {
        name: 'Quantity',
        selector: (row) => row.quantity,
        sortable: true,
      },
      {
        name: 'User',
        selector: (row) => row.userId?.mobile || "Anonymous",
        sortable: true,
      },
      {
        name: 'Added At',
        selector: (row) => {new Date(row.addedAt).toLocaleString()},
        sortable: true,
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
                <div className="col-md-12">
                    <div className="breadcrumb-wrap mb-g bg-red-gradient">
                        <div className="row">
                            <div className="col-md-12">
                              <div className="dashboard-title">
                                <h2>Cart Details</h2>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">
                  <div className="breadcrumb-wrap">

                  <div className="row">
                  <div className="col-md-8">
                      <div className="total-record">
                      <p>Total Records: <span> {filteredcartDetails.length}</span> </p>
                      </div>
                  </div>
                  <div className="col-md-4">
                  <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search categories..."
            value={search}
            onChange={handleSearch}
          />
        </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
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
          {currentRecords.map((row, rowIndex) => (
            <tr key={row._id}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.cell ? col.cell(row, rowIndex) : col.selector(row, rowIndex)}
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
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value="all">All</option>
        </select>
        Products
      </p>
          {/* Pagination Controls */}
{/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="pagination ">
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
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
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
                </div>
            </div>
        </div>
      
    </div>
    <AdminFooter/>
    </div>
  );
};

export default CartDetails;
