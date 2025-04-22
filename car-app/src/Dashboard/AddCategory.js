import React, { useState, useEffect } from 'react';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import AdminHeader from './AdminHeader'
import AdminFooter from './AdminFooter';

const AddCategory = () => {



  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
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
      categorytitle: '',
      categoryfile: null,
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
          categoryfile: e.target.files[0],
        });
      };
    


      const categoryhandleSubmit = (e) => {
        e.preventDefault();
      
        const data = new FormData();
        data.append('categorytitle', formData.categorytitle);
        if (formData.categoryfile) {
          data.append('categoryfile', formData.categoryfile);  // Only append file if a new file is selected
        }
      
        const url = isEditing
          ? `http://localhost:5000/categories/${editCategoryId}`
          : 'http://localhost:5000/upload/category';
      
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
            setMessage(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
            setTimeout(() => setMessage(''), 3000);
      
            // Fetch the updated categories list
            axios.get('http://localhost:5000/categories').then((res) => setCategories(res.data));
      
            // Reset form and exit editing mode
            setFormData({ categorytitle: '', categoryfile: null });
            setIsEditing(false);
            setEditCategoryId(null);
          })
          .catch((error) => {
            setMessage('Error submitting the form.');
            console.error('Error:', error);
          });
      };
      



      
    
  // Fetch data from backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
      setFilteredCategories(response.data); // Initially, show all categories
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      axios
        .delete(`http://localhost:5000/categories/${id}`)
        .then(() => {
          setCategories(categories.filter((category) => category._id !== id));
          setFilteredCategories(filteredCategories.filter((category) => category._id !== id));
          toast.success('Category deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
          toast.error('Failed to delete category.');
        });
    }
  };


  const [isEditing, setIsEditing] = useState(false);  // To check if editing mode is enabled
  const [editCategoryId, setEditCategoryId] = useState(null);  // Store the category ID being edited

  const handleEdit = (row) => {
    setIsEditing(true);  // Enable editing mode
    setEditCategoryId(row._id);  // Set the category ID being edited
    setFormData({
      subtitle: row.subtitle,
      categorytitle: row.categorytitle,
      categoryfile: null,  // Reset the file input, user can upload a new one if needed
    });
  };


  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = categories.filter((category) =>
      category.categorytitle.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };


  // Dynamically calculate pagination options
  const calculatePaginationOptions = () => {
    const totalRows = filteredCategories.length;
    const options = [5, 10, 20];
    if (totalRows > 20) options.push(totalRows); // Add total rows as a pagination option if more than 20
    return options;
  };



  // Pagination Logic
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = rowsPerPage === "all" ? filteredCategories : filteredCategories.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(filteredCategories.length / rowsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    const value = e.target.value === "all" ? "all" : parseInt(e.target.value);
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to the first page
  };
 


   // Define DataTable columns
   const columns = [
    {
      name: 'No',
      cell: (row, index) => {
        // Use all records if "all" is selected, otherwise calculate based on rowsPerPage
        const effectiveRowsPerPage =
          rowsPerPage === 'all' ? filteredCategories.length : rowsPerPage;
        return (currentPage - 1) * effectiveRowsPerPage + index + 1;
      },
      sortable: false,
    },
    {
      name: 'Category Heading',
      selector: (row) => row.categorytitle,
      sortable: true,
    },
    {
      name: 'Category Image',
      cell: (row) =>
        row.categoryfile ? (
          <img
            src={`http://localhost:5000/uploads/${row.categoryfile}`}
            alt={row.categorytitle}
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
          <button
            className="btn-home-edit me-2"
            onClick={() => { toggleForm(); handleEdit(row);}}
          >
            <i class="bi bi-pencil-square"></i>
          </button>
          <button
            className="btn-home-delete"
            onClick={() => handleDelete(row._id)}
          >
            <i class="bi bi-trash"></i>
          </button>
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
                                    <h2>Category</h2>
                                    
                                  </div>
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                    </div>
                </div>


<div className="row">
  <div className='col-md-12'>
    <div className="breadcrumb-wrap">

    <div className="row">
      <div className="col-md-12">
        <a className="btn btn-add" onClick={toggleForm}>
          <span><i class="bi bi-plus-square-fill"></i></span> Add Category
        </a> 
      </div>
    </div>

                <div className="row">
                    <div className="col-xl-8 col-lg-8 offset-lg-2 offset-xl-2">
                        { /* Step 3: Conditionally render the form */ }
            {showForm && (
              <div className="card mt-4 mb-4">
                <div className="card-header text-capitalize text-center h5">
  {isEditing ? 'Edit Category' : 'Add Home Category'}
</div>
<div className="mb-3">
  {/* <button type="submit" className="btn btn-info w-100">
    {isEditing ? 'Update' : 'Submit'}
  </button> */}
</div>
  
                <div className="card-body">
                  
                    {/* Display success/error message */}
      {message && <div className="alert alert-info mt-3">{message}</div>}

                <form onSubmit={categoryhandleSubmit} encType="multipart/form-data">

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          name="categorytitle"
          placeholder="Category Title"
          value={formData.categorytitle}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="file"
          id="formFile"
          name="categoryfile"
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
                      <p>Total Records: <span> {filteredCategories.length}</span> </p>
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

      <AdminFooter/>

    </div>

 ) };

export default AddCategory