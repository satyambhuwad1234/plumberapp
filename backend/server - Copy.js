const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require("twilio");



// const adminRoutes = require('./routes/adminRoutes');  

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// API routes
// app.use("/api", routes);



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from 'uploads' folder

// File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
    }
  });
  
  const upload = multer({ storage });





// 1. **Mongoose Model User Schema**
// **User Schema**
const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  otp: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// **Twilio Setup**
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP to multiple numbers
// Send OTP to multiple numbers
app.post("/api/send-otp", async (req, res) => {
  const { mobiles } = req.body; // Expecting an array of mobile numbers
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    // Check if mobiles is an array and not empty
    if (!Array.isArray(mobiles) || mobiles.length === 0) {
      return res.status(400).json({ error: "No mobile numbers provided" });
    }

    // Iterate through each mobile number and send OTP
    for (const mobile of mobiles) {
      let user = await User.findOne({ mobile });
      if (!user) {
        user = new User({ mobile });
      }

      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();

      // Send OTP to each mobile number
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
        to: `+91${mobile}` // Ensure the number is formatted correctly
      }).then((message) => {
        console.log(`Message sent to ${mobile}: ${message.sid}`);
      }).catch((error) => {
        console.error(`Error sending message to ${mobile}: ${error.message}`);
      });
    }

    res.status(200).json({ message: "OTP sent successfully to all numbers" });
  } catch (error) {
    console.error("Error sending OTP: ", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});



// Verify OTP
app.post("/api/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const user = await User.findOne({ mobile });
    if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});




  
  // Banner Schema
  const bannerSchema = new mongoose.Schema({
    bannertitle: String,
    bannerfile: String,
  });
  
  const Banner = mongoose.model('Banner', bannerSchema);
  
  // Routes
  app.post('/upload', upload.single('bannerfile'), async (req, res) => {
    const { bannertitle } = req.body;
    const bannerfile = req.file.filename;
  
    const newBanner = new Banner({ bannertitle, bannerfile });
    await newBanner.save();
    res.json(newBanner);
  });
  
  app.get('/banners', async (req, res) => {
    const banners = await Banner.find();
    res.json(banners);
  });
  
  
  // Delete banner by ID
  app.delete('/banners/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBanner = await Banner.findByIdAndDelete(id);
  
      if (!deletedBanner) {
        return res.status(404).json({ message: 'Banner not found' });
      }
  
      res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
      console.error('Error deleting banner:', error);
      res.status(500).json({ message: 'Error deleting banner' });
    }
  });
  
  
  
  // Update banner by ID
  app.put('/banners/:id', upload.single('bannerfile'), async (req, res) => {
    const { id } = req.params;
    const { bannertitle } = req.body;
    let updatedBannerData = { bannertitle };
  
    // If a new banner file is uploaded, add it to the updated data
    if (req.file) {
      updatedBannerData.bannerfile = req.file.filename;
    }
  
    try {
      const updatedBanner = await Banner.findByIdAndUpdate(id, updatedBannerData, { new: true });
  
      if (!updatedBanner) {
        return res.status(404).json({ message: 'Banner not found' });
      }
  
      res.json(updatedBanner);
    } catch (error) {
      console.error('Error updating banner:', error);
      res.status(500).json({ message: 'Error updating banner' });
    }
  });





  
  // Category Schema
  const categorySchema = new mongoose.Schema({
    categorytitle: String,
    categoryfile: String,
  });


  const Category = mongoose.model('Category', categorySchema);


  // Routes
  app.post('/upload/category', upload.single('categoryfile'), async (req, res) => {
    try {
      const { categorytitle } = req.body;
  
      // Validate required fields
      if (!categorytitle || !req.file) {
        return res.status(400).json({ message: 'Category title and file are required.' });
      }
  
      const categoryfile = req.file.filename;
  
      const newCategory = new Category({ categorytitle, categoryfile });
      await newCategory.save();
  
      res.status(201).json(newCategory); // Return created category with 201 status
    } catch (error) {
      console.error('Error uploading category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
  });
  
  

    // Delete category by ID
  app.delete('/categories/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(id);
  
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error deleting category' });
    }
  });



  // Update category by ID
  app.put('/categories/:id', upload.single('categoryfile'), async (req, res) => {
    try {
      const { id } = req.params;
      const { categorytitle } = req.body;
  
      if (!categorytitle) {
        return res.status(400).json({ message: 'Category title is required.' });
      }
  
      const updatedCategoryData = { categorytitle };
  
      if (req.file) {
        updatedCategoryData.categoryfile = req.file.filename;
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(id, updatedCategoryData, { new: true });
  
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  //*******************************
  
  //Product Schema
  
  //***************************** */


// Product Schema
const ProductSchema = new mongoose.Schema({
  productname: String,
  productprice: Number,
  productsaleprice: Number,
  productcategory: String,
  productfile: String,
});

const Product = mongoose.model('Product', ProductSchema);

// Add Product API
app.post('/products', upload.single('productfile'), async (req, res) => {
  try {
    const { productname, productprice, productsaleprice, productcategory } = req.body;
    if (!productname || !productprice || !productsaleprice || !productcategory || !req.file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({
      productname,
      productprice,
      productsaleprice,
      productcategory,
      productfile: req.file.filename,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch Products by Category API
app.get('/products/category/:categoryTitle', async (req, res) => {
  try {
    const { categoryTitle } = req.params;
    const products = await Product.find({
      productcategory: { $regex: new RegExp(categoryTitle, 'i') }, // Case-insensitive search
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch All Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  // Delete a product by ID
  app.delete('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  // Update a product by ID
  app.put('/products/:id', upload.single('productfile'), async (req, res) => {
    try {
      const { id } = req.params;
      const { productname, productprice, productsaleprice, productcategory } = req.body;
  
      if (!productname || !productprice || !productsaleprice || !productcategory) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const updatedData = {
        productname,
        productprice,
        productsaleprice,
        productcategory,
      };
  
      if (req.file) {
        updatedData.productfile = req.file.filename;
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



// Fetch Categories (Example Category API)
app.get('/categories', async (req, res) => {
  try {
    // Example response; adjust to match your Category model
    res.json([
      { categorytitle: 'Tap & Mixer', categoryfile: 'tap-mixer.jpg' },
      { categorytitle: 'Toilet', categoryfile: 'toilet.jpg' },
      { categorytitle: 'Basin & Sink', categoryfile: 'basin-sink.jpg' },
    ]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//************************************************* */
//  Cart Schema
//************************************************ */

// Cart Schema and Model
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productSalePrice: { type: Number, required: true },
  productImage: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});
const Cart = mongoose.model("Cart", cartSchema);

// Routes and Logic

// Add product to cart (with quantity handling)
app.post("/api/cart/add", async (req, res) => {
  const { userId, productId, productName, productPrice, productSalePrice, productImage, quantity } = req.body;

  try {
    // Check if the product already exists in the user's cart
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      // If product exists, update the quantity
      existingCartItem.quantity += quantity || 1; // Default to 1 if quantity is not provided
      await existingCartItem.save();
      res.status(200).json({ message: "Product quantity updated in cart" });
    } else {
      // If product does not exist, create a new cart item
      const cartItem = new Cart({
        userId,
        productId,
        productName,
        productPrice,
        productSalePrice,
        productImage,
        quantity: quantity || 1, // Default to 1 if quantity is not provided
      });

      await cartItem.save();
      res.status(200).json({ message: "Product added to cart successfully" });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});


// Get all cart details (for admin)
app.get("/api/cart/details", async (req, res) => {
  try {
    const cartDetails = await Cart.find().populate("userId").populate("productId");
    res.status(200).json(cartDetails);
  } catch (error) {
    console.error("Error fetching cart details:", error);
    res.status(500).json({ error: "Failed to fetch cart details" });
  }
});



// Get Cart Items for a User

app.get("/api/cart/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await Cart.find({ userId }).populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});


// Remove Item from Cart

app.delete("/api/cart/remove/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});




//**********************************************************/
//DatePicker Schema
//*********************************************************/

// Define Schema and Model
const dateTimeSchema = new mongoose.Schema({
  date: String,
  time: String,
});

const DateTime = mongoose.model("DateTime", dateTimeSchema);


// POST API to save date and time
app.post("/api/datetime", async (req, res) => {
  const { date, time } = req.body;
  const userId = req.user.id; // Get the logged-in user's ID from the authenticated request

  if (!date || !time) {
      return res.status(400).json({ message: "Date and Time are required" });
  }

  try {
      const newEntry = new DateTime({
          date,
          time,
          userId, // Save the userId associated with this entry
      });
      await newEntry.save();
      res.status(201).json({ message: "Date and Time saved successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Error saving data", error });
  }
});

// GET API to fetch all date and time records
app.get("/api/datetime", async (req, res) => {
  try {
      const records = await DateTime.find();
      res.status(200).json(records);
  } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
  }
});


// Edit date and time records
app.put("/api/datetime/:id", async (req, res) => {
  const { id } = req.params;
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ message: "Date and Time are required" });
  }

  try {
    const updatedEntry = await DateTime.findByIdAndUpdate(
      id,
      { date, time },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "DateTime record not found" });
    }

    res.status(200).json({
      message: "Date and Time updated successfully!",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Error updating data", error });
  }
});

// Delete date and time record
app.delete("/api/datetime/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await DateTime.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "DateTime record not found" });
    }

    res.status(200).json({ message: "Date and Time deleted successfully!" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ message: "Error deleting data", error });
  }
});






//**************************************************************/
// Address Schema 
//*************************************************************/

// Address Schema
const addressSchema = new mongoose.Schema({
  fname: String,
  country: String,
  town: String,
  pincode: String,
  house: String,
});

const Address = mongoose.model("Address", addressSchema);

// POST API to save address
app.post("/api/address", async (req, res) => {
  const { fname, country, town, pincode, house} = req.body;
  if (!fname || !country || !town || !pincode || !house) {
      return res.status(400).json({ message: "All fields are required" });
  }
  try {
      const newAddress = new Address({ fname, country, town, pincode, house });
      await newAddress.save();
      res.status(201).json({ message: "Address saved successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Error saving address", error });
  }
});

// GET API to fetch all addresses
app.get("/api/address", async (req, res) => {
  try {
      const addresses = await Address.find();
      res.status(200).json(addresses);
  } catch (error) {
      res.status(500).json({ message: "Error fetching addresses", error });
  }
});

// PUT API to edit an address
app.put("/api/address/:id", async (req, res) => {
  const { id } = req.params;
  const { fname, country, town, pincode, house } = req.body;

  try {
      const updatedAddress = await Address.findByIdAndUpdate(
          id,
          { fname, country, town, pincode, house },
          { new: true } // Return the updated document
      );
      res.status(200).json({ message: "Address updated successfully!", updatedAddress });
  } catch (error) {
      res.status(500).json({ message: "Error updating address", error });
  }
});


// DELETE API to delete an address
app.delete("/api/address/:id", async (req, res) => {
  const { id } = req.params;

  try {
      await Address.findByIdAndDelete(id);
      res.status(200).json({ message: "Address deleted successfully!" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting address", error });
  }
});



/******************************************************************/
//*****/ Payment Gateway**************
//*****************************************************************/

// Payment Schema and Model
const paymentSchema = new mongoose.Schema({
  orderId: String,
  userId: String,
  totalAmount: Number,
  paymentStatus: String,
  paymentMethod: String,
  cartItems: [
    {
      productName: String,
      image: String,
      quantity: Number,
      price: Number,
    },
  ],
  taxesAndFee: Number,
  visitationFee: Number,
  paymentDetails: mongoose.Schema.Types.Mixed, // Adjust for flexibility
});


const Payment = mongoose.model("Payment", paymentSchema);


// Save Payment Endpoint
// Route to save payment and move cart items to bookings
app.post("/api/save-payment", async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Request Body:", req.body);

    const { orderId, userId, totalAmount, paymentStatus, paymentMethod, cartItems } = req.body;

    if (!orderId || !userId || !totalAmount || !paymentStatus || !paymentMethod || !cartItems) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Save payment and booking logic here

    res.json({ message: "Payment successful and booking created." });
  } catch (error) {
    console.error("Error saving payment and booking:", error);
    res.status(500).json({ message: "Failed to save payment and booking." });
  }
});



// Get All Payments for Admin
app.get("/api/admin/payments", async (req, res) => {
  try {
    const payments = await Payment.find(); // Fetch all payment records
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Failed to fetch payments.", error: error.message });
  }
});











// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
