import React, { useState, useEffect } from 'react';
import { toast, ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import AdminHeader from './AdminHeader';

const ProductDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productname: '',
    productprice: '',
    productsaleprice: '',
    productcategory: '',
    productfile: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));

    fetchProducts();
  }, []);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
      setFilteredProducts(response.data); // Initially, show all categories
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      productfile: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('productname', formData.productname);
    data.append('productprice', formData.productprice);
    data.append('productsaleprice', formData.productsaleprice);
    data.append('productcategory', formData.productcategory);
    if (formData.productfile) data.append('productfile', formData.productfile);

    const url = isEditing
      ? `http://localhost:5000/products/${editProductId}`
      : 'http://localhost:5000/products';

    const method = isEditing ? axios.put : axios.post;

    method(url, data)
      .then(() => {
        alert(isEditing ? 'Product updated successfully' : 'Product added successfully');
        fetchProducts();
        setShowForm(false);
        setIsEditing(false);
        setEditProductId(null);
        setFormData({
          productname: '',
          productprice: '',
          productsaleprice: '',
          productcategory: '',
          productfile: null,
        });
      })
      .catch((error) => console.error('Error saving product:', error));
  };

  const handleEdit = (product) => {
    setShowForm(true);
    setIsEditing(true);
    setEditProductId(product._id);
    setFormData({
      productname: product.productname,
      productprice: product.productprice,
      productsaleprice: product.productsaleprice,
      productcategory: product.productcategory,
      productfile: null,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this Product?')) {
      axios.delete(`http://localhost:5000/products/${id}`)
        .then(() => {
          toast.success('Product deleted successfully!');
          fetchProducts();
        })
        .catch((error) => {
          console.error('Error deleting Product:', error);
          toast.error('Failed to delete Product.');
        });
    }
  };


  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = products.filter((product) =>
      product.productname.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

   // Dynamically calculate pagination options
   const calculatePaginationOptions = () => {
    const totalRows = filteredProducts.length;
    const options = [5, 10, 20];
    if (totalRows > 20) options.push(totalRows); // Add total rows as a pagination option if more than 20
    return options;
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = rowsPerPage === "all" ? filteredProducts : filteredProducts.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(filteredProducts.length / rowsPerPage);


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
        rowsPerPage === 'all' ? filteredProducts.length : rowsPerPage;
      return (currentPage - 1) * effectiveRowsPerPage + index + 1;
    },
    sortable: false,
  },
  {
    name: 'Product Name',
    selector: (row) => row.productname,
    sortable: true,
  },
  {
    name: 'Price',
    selector: (row) => row.productprice,
    sortable: true,
  },
  {
    name: 'Sale Price',
    selector: (row) => row.productsaleprice,
    sortable: true,
  },
  {
    name: 'Category',
    selector: (row) => row.productcategory,
    sortable: true,
  },
   
  {
    name: 'Category Image',
    cell: (row) =>
      row.productfile ? (
        <img src={`http://localhost:5000/uploads/${row.productfile}`} 
        alt={row.productname} 
        style={{ width: '50px' }}
        />
      ) : (
        <span>No Image</span>
      ),
  },
  {
    name: 'Actions',
    cell: (row) => (
      <>
        <button className="btn-home-edit me-2" onClick={() => handleEdit(row)}>
          <i class="bi bi-pencil-square"></i>
        </button>
        <button className="btn-home-delete" onClick={() => handleDelete(row._id)}>
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
        <AdminHeader />
          <div className="row">
            <div className="col-xl-12 col-lg-12">
              <div className="breadcrumb-wrap mb-g bg-red-gradient">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="dashboard-title">
                      <h2>Products</h2>
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
          <a className="btn btn-add" onClick={() => setShowForm(!showForm)}>
                      <span><i class="bi bi-plus-square-fill"></i></span> Add Product
                      </a>
          </div>
         </div>

              <div className="row">
                    <div className="col-xl-8 col-lg-8 offset-lg-2 offset-xl-2">

          {showForm && (
            <div className="card mt-4 mb-4">
              <div className="card-header text-center h5">
                {isEditing ? 'Edit Product Details' : 'Add Product Details'}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="productname"
                      placeholder="Product Name"
                      value={formData.productname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="productprice"
                      placeholder="Product Price"
                      value={formData.productprice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="productsaleprice"
                      placeholder="Product Sale Price"
                      value={formData.productsaleprice}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      name="productcategory"
                      value={formData.productcategory}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.categorytitle}>
                          {category.categorytitle}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <input
                      className="form-control"
                      type="file"
                      name="productfile"
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
                      <p>Total Records: <span> {filteredProducts.length}</span> </p>
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

          <div className="row mt-5">
            <div className="col-12">
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
  );
};

export default ProductDetails;
