import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader'

const AddCategory = () => {


  const [categories, setCategories] = useState([]);


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
    axios
      .get('https://plumber.metiermedia.com/categories')
      .then((response) => {
        setCategories(response.data); // Set the categories data into state
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);



  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      axios
        .delete(`https://plumber.metiermedia.com/categories/${id}`)
        .then((response) => {
          setCategories(categories.filter((category) => category._id !== id)); // Remove deleted category from state
          console.log('Category deleted:', response.data);
        })
        .catch((error) => {
          console.error('Error deleting category:', error);
        });
    }
  };


  const [isEditing, setIsEditing] = useState(false);  // To check if editing mode is enabled
  const [editCategoryId, setEditCategoryId] = useState(null);  // Store the category ID being edited

  const handleEdit = (category) => {
    setIsEditing(true);  // Enable editing mode
    setEditCategoryId(category._id);  // Set the category ID being edited
    setFormData({
      subtitle: category.subtitle,
      categorytitle: category.categorytitle,
      categoryfile: null,  // Reset the file input, user can upload a new one if needed
    });
  };



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
                                  <div className="dashboard-title">
                                    <h2>Add Category</h2>
                                    <a className="btn btn-add" onClick={toggleForm}>
                                    <i class="bi bi-plus-square-fill"></i>
                                    </a> 
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="row">
                    <div className="col-xl-8 col-lg-8 offset-lg-2 offset-xl-2">
                        { /* Step 3: Conditionally render the form */ }
            {showForm && (
              <div className="card mt-4">
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
                    <div className="col-md-12">
                    <div className="table-responsive">
                 <table className="table table-bordered">
      <thead>
        <tr>
          <th className="bg-dark text-white">No</th>
          <th className="bg-dark text-white">Category Heading</th>
          <th className="bg-dark text-white">Category Images</th>
          <th className="bg-dark text-white">Action</th>
        </tr>
      </thead>
      <tbody>
      {categories.map((category, index) => (
  <tr key={category._id}>
    <td>{index + 1}</td>
    <td>{category.categorytitle}</td>
    <td>
      {category.categoryfile ? (
        <img
          src={`http://localhost:5000/uploads/${category.categoryfile}`}
          style={{ width: '150px', height: 'auto' }}
          alt={category.categorytitle}
        />
      ) : (
        <span>No Image</span>
      )}
    </td>
    <td>
      
      
      <a className="btn-home-edit me-2" href="#" onClick={() => { toggleForm(); handleEdit(category);}}>
        <i class="bi bi-pencil-square"></i>
      </a>
      <a href="#" className="btn-home-delete" onClick={() => handleDelete(category._id)}>
        <i class="bi bi-trash"></i>
      </a>
    
    </td>
  </tr>
))}

      </tbody>
    </table>
                  </div>
                    </div>
                </div>




                








        </div>
      </div>

    </div>

 ) };

export default AddCategory