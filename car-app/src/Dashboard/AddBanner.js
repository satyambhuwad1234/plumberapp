import React, { useState, useEffect } from 'react';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from './AdminHeader';
import axios from 'axios';
import AdminFooter from './AdminFooter';

const AddBanner = () => {


    const [banners, setBanners] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page


  // Step 1: Declare state for showing/hiding form
  const [showForm, setShowForm] = useState(false);

   // Step 2: Function to toggle the form visibility 
    const toggleForm = () => {
     setShowForm(!showForm);
   };



    //   Data Save into database
 
    const [formData, setFormData] = useState({
        bannertitle: '',
        bannerfile: null,
      });
      const [message, setMessage] = useState(''); // For storing success/error message
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleFileChange = (e) => {
        setFormData({
          ...formData,
          bannerfile: e.target.files[0],
        });
      };
    


      const handleSubmit = (e) => {
        e.preventDefault();
      
        const data = new FormData();
        data.append('bannertitle', formData.bannertitle);
        if (formData.bannerfile) {
          data.append('bannerfile', formData.bannerfile);  // Only append file if a new file is selected
        }
      
        const url = isEditing
          ? `http://localhost:5000/banners/${editBannerId}`
          : 'http://localhost:5000/upload';
      
        const method = isEditing ? 'put' : 'post';
      
        axios({
          method: method,
          url: url,
          data: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then((response) => {
            setMessage(isEditing ? 'Banner updated successfully!' : 'Banner created successfully!');
            setTimeout(() => setMessage(''), 3000);
      
            // Fetch the updated banners list
            axios.get('http://localhost:5000/banners').then((res) => setBanners(res.data));
      
            // Reset form and exit editing mode
            setFormData({ bannertitle: '', bannerfile: null });
            setIsEditing(false);
            setEditBannerId(null);
          })
          .catch((error) => {
            setMessage('Error submitting the form.');
            console.error('Error:', error);
          });
      };
      

      
      // Fetch data from backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/banners')
      .then((response) => {
        setBanners(response.data); // Set the banners data into state
        setFilteredBanners(response.data); // Initially, show all categories
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []);



  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      axios
        .delete(`http://localhost:5000/banners/${id}`)
        .then((response) => {
          // Update state using the functional form of setBanners
          setBanners((prevBanners) =>
            prevBanners.filter((banner) => banner._id !== id)
          );
          toast.success('Banner deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting banner:', error);
          toast.error('Failed to delete Banner.');
        });
    }
  };
  


  const [isEditing, setIsEditing] = useState(false);  // To check if editing mode is enabled
  const [editBannerId, setEditBannerId] = useState(null);  // Store the banner ID being edited

  const handleEdit = (banner) => {
    setIsEditing(true);  // Enable editing mode
    setEditBannerId(banner._id);  // Set the banner ID being edited
    setFormData({
      subtitle: banner.subtitle,
      bannertitle: banner.bannertitle,
      bannerfile: null,  // Reset the file input, user can upload a new one if needed
    });
  };
  


  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = banners.filter((banner) =>
      banner.bannertitle.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBanners(filtered);
  };


  // Define DataTable columns
  const columns = [
    {
      name: 'Sr. No',
      cell: (row, index) => {
        // Use all records if "all" is selected, otherwise calculate based on rowsPerPage
        const effectiveRowsPerPage =
          rowsPerPage === 'all' ? filteredBanners.length : rowsPerPage;
        return (currentPage - 1) * effectiveRowsPerPage + index + 1;
      },
      sortable: false,
    },
    {
      name: 'Banner Title',
      selector: (row) => row.bannertitle,
      sortable: true,
    },
    {
      name: 'Banner Image',
      cell: (row) =>
        row.bannerfile ? (
          <img
            src={`http://localhost:5000/uploads/${row.bannerfile}`}
            alt={row.bannertitle}
            style={{ width: '50px', height: 'auto' }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <a className="btn-home-edit me-2" href="#" onClick={() => { toggleForm(); handleEdit(row);}}>
      <i class="bi bi-pencil-square"></i>
  </a>
  <a href="#" className="btn-home-delete" onClick={() => handleDelete(row._id)}>
        <i class="bi bi-trash"></i>
      </a>
        </>
      ),
    },
  ];


  // Dynamically calculate pagination options
  const calculatePaginationOptions = () => {
    const totalRows = filteredBanners.length;
    const options = [5, 10, 20];
    if (totalRows > 20) options.push(totalRows); // Add total rows as a pagination option if more than 20
    return options;
  };


  // Pagination Logic
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = rowsPerPage === "all" ? filteredBanners : filteredBanners.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(filteredBanners.length / rowsPerPage);

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    const value = e.target.value === "all" ? "all" : parseInt(e.target.value);
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to the first page
  };



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
                                    <h2>Banners</h2>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>

 
              <div className="row">
                <div className="col-md-12">
                  <div className="breadcrumb-wrap">

                

              <div className="row">
                <div className="col-md-12">
                <a className="btn btn-add" onClick={toggleForm}>
                  <span><i class="bi bi-plus-square-fill"></i></span> Add banner
                </a>
                </div>
              </div>

                <div className="row">
                    <div className="col-xl-8 col-lg-8 offset-lg-2 offset-xl-2">
                        
                        { /* Step 3: Conditionally render the form */ }
            {showForm && (
              <div className="card mt-4 mb-4">
                <div className="card-header text-capitalize text-center h5">
  {isEditing ? 'Edit Banner' : 'Add Home Banner'}
</div>
<div className="mb-3">
  {/* <button type="submit" className="btn btn-info w-100">
    {isEditing ? 'Update' : 'Submit'}
  </button> */}
</div>
  
                <div className="card-body">
                    {/* Display success/error message */}
      {message && <div className="alert alert-info mt-3">{message}</div>}

                <form onSubmit={handleSubmit} encType="multipart/form-data">

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="bannertitle"
          placeholder="Banner Title"
          value={formData.bannertitle}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="file"
          id="formFile"
          name="bannerfile"
          onChange={handleFileChange}
        />
        
      </div>
      <div className="mb-3">
        <button type="submit" className="btn btn-info w-100">Submit</button>
      </div>

      
    </form>

                </div>
              </div>
              )}
                       
                    </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="total-record">
                      <p>Total Records: <span>{filteredBanners.length}</span></p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search Banners..."
                        value={search}
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                </div>


                <div className="row">
                    <div className="col-md-12">
                    <div className="table-responsive">
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
          <option value={5}>5</option>
          <option value={10}>10</option>
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
        </div>
<AdminFooter/>
    </div>
  )
}

export default AddBanner