<<<<<<< HEAD
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
// ✅ Use CORS with your frontend domain (Hostinger)
app.use(cors({
  origin: 'https://plumber.metiermedia.com',
  credentials: true,
}));
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
    // Populate userId to include the mobile number
    const cartDetails = await Cart.find()
      .populate({ path: "userId", select: "mobile" })
      .populate("productId");
      
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
  date: { type: String, required: true },
  time: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Required and linked to User
});

const DateTime = mongoose.model("DateTime", dateTimeSchema);


// POST API to save date and time
app.post("/api/datetime", async (req, res) => {
  const { date, time, userId } = req.body;

  console.log("Incoming Request Body:", req.body);

  if (!date || !time ) {
    return res.status(400).json({ message: "Date, Time are required" });
  }

  try {
    const newEntry = new DateTime({ date, time, userId });
    await newEntry.save();
    res.status(201).json({ message: "Date and Time saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data", error: error.message });
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Required and linked to User
});

const Address = mongoose.model("Address", addressSchema);

// POST API to save address
app.post("/api/address", async (req, res) => {
  const { fname, country, town, pincode, house, userId } = req.body;
  if (!fname || !country || !town || !pincode || !house || !userId) {
      return res.status(400).json({ message: "All fields are required" });
  }
  try {
      const newAddress = new Address({ fname, country, town, pincode, house, userId });
      await newAddress.save();
      res.status(201).json({ message: "Address saved successfully!", newAddress });
  } catch (error) {
      console.error("Error saving address:", error); // Log the error
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



// Example in Seach Services
app.get('/products/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const products = await Product.find({
      productname: { $regex: query, $options: 'i' },
    }).select('productname productcategory _id'); // Include categoryTitle
    res.json(products);
  } catch (error) {
    console.error('Error fetching products for search:', error);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
});




const JWT_SECRET = "your_jwt_secret_key"; // Replace with a strong secret key

// Admin Schema
const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_number: { type: String, required: true },
  role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
  // If username is not required, define it like this:
  username: { type: String }, // Remove unique: true if not needed
});


const AdminUser = mongoose.model("AdminUser", AdminUserSchema);



// Register Admin
app.post("/register", async (req, res) => {
  const { name, email, password, contact_number, role } = req.body;

  // Validate input
  if (!name || !email || !password || !contact_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingAdminUser = await AdminUser.findOne({ email });
    if (existingAdminUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newAdminUser = new AdminUser({
      name,
      email,
      password: hashedPassword,
      contact_number,
      role: role || "admin", // Default role is "admin" if not provided
      username: email.split("@")[0], // Example: generate username from email
    });

    await newAdminUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch all admin users
app.get("/api/adminusers", async (req, res) => {
  try {
    const users = await AdminUser.find({}, "-password"); // Exclude passwords from the result
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Assuming you have Mongoose set up and a User model
app.get("/api/adminusers/:id", async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id, "-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Send user data as response
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});








// Admin Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the admin exists
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: admin._id, name: admin.name, role: admin.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log("Decoded token:", decoded);  // Log the decoded token for debugging
    req.user = decoded;  // Attach decoded info to request object
    next();
  });
};


// Protected Admin Route Example
app.get("/dashboard", authenticateToken, (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
});



/******************************************************************/
//*****/ Service Partner**************
//*****************************************************************/

// Service Partner
const ServicePartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: [/.+@.+\..+/, "Please enter a valid email address"] },
  contact_number: { type: String, required: true, match: [/^\d{10}$/, "Contact number must be 10 digits"] },
  service_name: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true, match: [/^\d{6}$/, "Contact number must be 6 digits"] },
});

const ServicePartner = mongoose.model("ServicePartner", ServicePartnerSchema);


// Register Admin
app.post("/servicepartner", async (req, res) => {
  const { name, email, contact_number, service_name, address, area, city, pincode  } = req.body;

  // Validate input
  if (!name || !email || !contact_number || !service_name || !address || !area || !city || !pincode ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingServicePartner = await ServicePartner.findOne({ email });
    if (existingServicePartner) {
      return res.status(400).json({ message: "User already exists" });
    }


    // Create new user
    const newServicePartner= new ServicePartner({
      name,
      email,
      contact_number,
      service_name,
      address,
      area,
      city,
      pincode,
   
    });

    await newServicePartner.save();

    res.status(201).json({ message: "Service Partner registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch all service partners
app.get("/servicepartners", async (req, res) => {
  try {
    const partners = await ServicePartner.find();
    res.status(200).json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a service partner
app.delete("/servicepartner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ServicePartner.findByIdAndDelete(id);
    res.status(200).json({ message: "Service partner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit Partner services
app.put("/servicepartner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPartner = await ServicePartner.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json(updatedPartner);
  } catch (error) {
    console.error("Error updating partner:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get a single service partner
app.get("/servicepartner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await ServicePartner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(200).json(partner);
  } catch (error) {
    console.error("Error fetching partner:", error);
    res.status(500).json({ message: "Server error" });
  }
});




/******************************************************************/
//*****/ Payment Gateway**************
//*****************************************************************/

// Payment Schema and Model
const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  mobile: { type: String, required: true }, // Save the mobile number here
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cartItems: [
    {
      productName: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  datetime: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
  ], // Define the structure of the datetime array
  address: [
    {
    fname: String,
    country: String,
    town: String,
    pincode: String,
    house: String,
  },
 ],// Define the structure of the Address array
  taxesAndFee: { type: Number, default: 0 },
  visitationFee: { type: Number, default: 0 },
  visitingStatus: { type: String, default: "Pending" },
  paymentDetails: mongoose.Schema.Types.Mixed, // Flexible field for payment details
  createdAt: { type: Date, default: Date.now },
});



const Payment = mongoose.model("Payment", paymentSchema);



// Route to save payment and move cart items to bookings
// Save Payment Endpoint
app.post("/api/save-payment", async (req, res) => {
  try {
    const { orderId, userId, totalAmount, paymentStatus, paymentMethod, cartItems, taxesAndFee, visitationFee, paymentDetails, datetime, address, mobile } = req.body;

    if (!orderId || !userId || !totalAmount || !paymentStatus || !paymentMethod || !cartItems || !datetime || !address || !mobile ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create a new payment document
    const newPayment = new Payment({
      orderId,
      userId,
      mobile,
      totalAmount,
      paymentStatus,
      paymentMethod,
      cartItems,
      datetime,
      address,
      taxesAndFee,
      visitationFee,
      paymentDetails,
      createdAt: new Date(),
    });

    // Save to MongoDB
    await newPayment.save();

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



app.get("/api/admin/payment/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Route to get payments for a specific user
app.get("/api/payments/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const payments = await Payment.find({ userId }); // Fetch payments for a specific user
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this user." });
    }
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments for user:", error);
    res.status(500).json({ message: "Failed to fetch payments." });
  }
});


// Update visiting status
app.put("/api/payments/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const payment = await Payment.findOneAndUpdate({ orderId }, { visitingStatus: status }, { new: true });

    if (!payment) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Visiting status updated.", payment });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status." });
  }
});




// Delete Payment by Payment ID
app.delete('/api/admin/payments/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Delete the payment with the specified paymentId
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found for the specified ID' });
    }

    res.status(200).json({
      message: 'Payment deleted successfully',
      deletedPayment,
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Failed to delete payment', error });
  }
});







// *********************************************************************
// *****Area Search then show Product list***********/
// *********************************************************************

// Endpoint to search products by city, area, or pincode
app.get("/products/search", async (req, res) => {
  const { location } = req.query; // Renamed 'term' to 'location'

  try {
      // Search for matching service partner based on city, area, or pincode
      const servicePartner = await ServicePartner.findOne({
          $or: [
              { city: { $regex: `^${location}$`, $options: 'i' } }, // Exact match for city name (case-insensitive)
              { area: { $regex: location, $options: 'i' } },         // Partial match for area (if needed)
              { pincode: location }                                  // Exact match for pincode
          ]
      });

      if (!servicePartner) {
          return res.status(404).json({ message: "No service partner found for the specified location" });
      }

      // If a service partner is found, search for products
      const products = await Product.find({
          // Filter products based on the service partner's area, city, or pincode
          $or: [
              { productcategory: { $regex: new RegExp(servicePartner.area, "i") } },
              { productcategory: { $regex: new RegExp(servicePartner.city, "i") } }
          ]
      });

      if (products.length === 0) {
          return res.status(404).json({ message: "No products found for the specified location" });
      }

      res.status(200).json(products);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error" });
  }
});



//**********************************************************************************/
//***********Booking All Summary********************/
//**********************************************************************************/

// Define the BookingSummary schema and model
const BookingSummarySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  mobile: { type: String, required: true }, // Save the mobile number here
  totalAmount: { type: Number, required: true },
  taxesAndFee: { type: Number, required: true },
  visitationFee: { type: Number, required: true },
  cartItems: [
    {
      productName: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  datetime: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
  address: [
    {
      fname: String,
      country: String,
      town: String,
      pincode: String,
      house: String,
    },
  ],
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  otp: { type: String, required: true },
  visitingStatus: { type: String, default: "Pending" },
  servicePartners: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true, match: [/.+@.+\..+/, "Please enter a valid email address"] },
      contact_number: { type: String, required: true, match: [/^\d{10}$/, "Contact number must be 10 digits"] },
      service_name: { type: String, required: true },
      address: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true, match: [/^\d{6}$/, "Pincode must be 6 digits"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const BookingSummary = mongoose.model('BookingSummary', BookingSummarySchema);





// Route to save booking summary and send OTP and messages
app.post("/api/save-booking-summary", async (req, res) => {
  try {
    const bookingData = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const address = bookingData.address[0];
    const { town: city, pincode } = address;

    // Find matching service partners
    const matchingPartners = await ServicePartner.find({ city, pincode });
    if (matchingPartners.length === 0) {
      return res.status(400).json({ message: "No service partners found." });
    }
    const selectedServicePartner = matchingPartners[0];

    // Prepare messages
    const servicePartnerMessage = `
      New Booking Received:
      Order ID: ${bookingData.orderId}.
      Customer Details: 
      Name: ${address.fname}, 
      Contact: ${bookingData.mobile}, 
      Address: ${address.house}, ${city}, ${pincode}.
      Verify Booking: http://localhost:3000/verify-booking/${bookingData.orderId}.
    `;

    const userMessage = `
      Your booking is confirmed:
      Order ID: ${bookingData.orderId}.
      Service Partner: ${selectedServicePartner.name}, 
      Contact: ${selectedServicePartner.contact_number}.
      OTP for verification: ${otp}.
    `;

    // Send SMS
    await sendSms(bookingData.mobile, userMessage);
    await sendSms(selectedServicePartner.contact_number, servicePartnerMessage);

    // Save booking
    const newBookingSummary = new BookingSummary({
      orderId: bookingData.orderId,
      userId: bookingData.userId,
      mobile:bookingData.mobile,
      totalAmount: bookingData.totalAmount,
      taxesAndFee: bookingData.taxesAndFee,
      visitationFee: bookingData.visitationFee,
      cartItems: bookingData.cartItems,
      datetime: bookingData.datetime,
      address: bookingData.address,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentStatus,
      otp,
      visitingStatus: "In Process",
      servicePartners: [{
        name: selectedServicePartner.name,
        email: selectedServicePartner.email,
        contact_number: selectedServicePartner.contact_number,
        service_name: selectedServicePartner.service_name,
        address: selectedServicePartner.address,
        area: selectedServicePartner.area,
        city: selectedServicePartner.city,
        pincode: selectedServicePartner.pincode,
      }],
    });

    await newBookingSummary.save();
    res.status(200).json({ message: "Booking saved and OTP sent successfully." });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Failed to save booking.", error: error.message });
  }
});





// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Twilio Client Initialization
const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);


// Function to send SMS
const sendSms = async (to, message) => {
  try {
    // Ensure the phone number is in E.164 format
    const sanitizedTo = to.startsWith("+") ? to : `+91${to.trim()}`; // Add +91 if not already present

    await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, // Use Messaging Service SID
      to: sanitizedTo,
      body: message,
    });
    console.log(`SMS sent to ${sanitizedTo}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error.message);
  }
};




// Example route for testing
app.post("/send-otp", async (req, res) => {
  const { mobile, message } = req.body;

  try {
    await sendSms(mobile, message);
    res.status(200).json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Verify booking and update status
// app.post("/api/verify-booking", async (req, res) => {
//   const { orderId, otp } = req.body;

//   try {
//     const booking = await BookingSummary.findOne({ orderId });

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found." });
//     }

//     if (booking.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP." });
//     }

//     booking.visitingStatus = "Completed";
//     await booking.save();

//     res.status(200).json({ message: "Booking verified and status updated." });
//   } catch (error) {
//     console.error("Error verifying booking:", error);
//     res.status(500).json({ message: "Failed to verify booking.", error: error.message });
//   }
// });

app.post("/api/verify-booking", async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    const booking = await BookingSummary.findOne({ orderId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // BookingSummary mein status update kare
    booking.visitingStatus = "Completed";
    await booking.save();

    // Payment collection mein bhi status update kare
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId },
      { visitingStatus: "Completed" },
      { new: true }
    );

    if (!updatedPayment) {
      console.warn(`Payment record not found for orderId: ${orderId}`);
    }

    res.status(200).json({ message: "Booking verified and status updated in both collections." });
  } catch (error) {
    console.error("Error verifying booking:", error);
    res.status(500).json({ message: "Failed to verify booking.", error: error.message });
  }
});




// Route to get all booking summaries
app.get("/api/all-booking-summaries", async (req, res) => {
  try {
    const bookings = await BookingSummary.find().populate("servicePartners");
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
  }
});



//view page 
app.get("/api/all-booking-summaries/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await BookingSummary.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking summary not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});






// after pending button click visiting status
app.post("/api/update-order-status", async (req, res) => {
  const { orderId } = req.body;

  try {
    // Order ko find karke status update kare
    const updatedOrder = await Payment.findOneAndUpdate(
      { orderId }, 
      { visitingStatus: "In Process" },
      { new: true }  // Yeh ensure karega ki updated document return ho
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete Payment by Payment ID
app.delete('/api/all-booking-summaries/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("Deleting booking with ID:", bookingId);

    const deletedBooking = await BookingSummary.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error("Error deleting Booking:", error);
    res.status(500).json({ message: 'Failed to delete Booking', error });
  }
});



//**********Dashboard**************

// Assuming you have already defined and imported your Payment model:
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const totalOrders = await Payment.countDocuments();
    const completedOrders = await Payment.countDocuments({ visitingStatus: "Completed" });
    const inProcessOrders = await Payment.countDocuments({ visitingStatus: "In Process" });
    const canceledOrders = await Payment.countDocuments({ visitingStatus: "Canceled" });
    const pendingOrders = await Payment.countDocuments({ visitingStatus: "Pending" });
    const totalCustomers = await User.countDocuments();
    const totalServicePartner = await ServicePartner.countDocuments();
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // If no documents found, totalAmount is 0
    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

     // Aggregation to calculate total amount per visiting status (for Completed, In Process, and Pending)
     const statusAmounts = await Payment.aggregate([
      {
        $match: { visitingStatus: { $in: ["Completed", "In Process", "Pending", "Canceled"] } }
      },
      {
        $group: {
          _id: "$visitingStatus",
          statusTotal: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Convert aggregation result to an object for easier access
    const statusTotals = {
      Completed: 0,
      "In Process": 0,
      Pending: 0,
      Canceled:0,
    };
    
    statusAmounts.forEach((group) => {
      statusTotals[group._id] = group.statusTotal;
    });

    res.status(200).json({
      totalOrders,
      completedOrders,
      inProcessOrders,
      canceledOrders,
      pendingOrders,
      totalCustomers,
      totalServicePartner,
      totalAmount,
      // Total amount for each visiting status
      completedAmount: statusTotals["Completed"],
      inProcessAmount: statusTotals["In Process"],
      pendingAmount: statusTotals["Pending"],
      canceledAmount:statusTotals["Canceled"]
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
});



//******************* */ Monthly Report********************

app.get('/api/monthly-report', async (req, res) => {
  try {
    const report = await Payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "Completed"] }, 1, 0] }
          },
          inProcessOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "In Process"] }, 1, 0] }
          },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "Canceled"] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "Pending"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalOrders: 1,
          totalAmount: 1,
          completedOrders: 1,
          inProcessOrders: 1,
          canceledOrders: 1,
          pendingOrders: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    // Optionally, round totalAmount values to two decimals
    const roundedReport = report.map(item => ({
      ...item,
      totalAmount: Math.round(item.totalAmount * 100) / 100
    }));

    res.status(200).json({ report: roundedReport });
  } catch (error) {
    console.error("Error generating monthly report:", error);
    res.status(500).json({ message: "Failed to generate monthly report", error: error.message });
  }
});








// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
=======
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
    // Populate userId to include the mobile number
    const cartDetails = await Cart.find()
      .populate({ path: "userId", select: "mobile" })
      .populate("productId");
      
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
  date: { type: String, required: true },
  time: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Required and linked to User
});

const DateTime = mongoose.model("DateTime", dateTimeSchema);


// POST API to save date and time
app.post("/api/datetime", async (req, res) => {
  const { date, time, userId } = req.body;

  console.log("Incoming Request Body:", req.body);

  if (!date || !time ) {
    return res.status(400).json({ message: "Date, Time are required" });
  }

  try {
    const newEntry = new DateTime({ date, time, userId });
    await newEntry.save();
    res.status(201).json({ message: "Date and Time saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data", error: error.message });
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Required and linked to User
});

const Address = mongoose.model("Address", addressSchema);

// POST API to save address
app.post("/api/address", async (req, res) => {
  const { fname, country, town, pincode, house, userId } = req.body;
  if (!fname || !country || !town || !pincode || !house || !userId) {
      return res.status(400).json({ message: "All fields are required" });
  }
  try {
      const newAddress = new Address({ fname, country, town, pincode, house, userId });
      await newAddress.save();
      res.status(201).json({ message: "Address saved successfully!", newAddress });
  } catch (error) {
      console.error("Error saving address:", error); // Log the error
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



// Example in Seach Services
app.get('/products/search/:query', async (req, res) => {
  const { query } = req.params;
  try {
    const products = await Product.find({
      productname: { $regex: query, $options: 'i' },
    }).select('productname productcategory _id'); // Include categoryTitle
    res.json(products);
  } catch (error) {
    console.error('Error fetching products for search:', error);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
});




const JWT_SECRET = "your_jwt_secret_key"; // Replace with a strong secret key

// Admin Schema
const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_number: { type: String, required: true },
  role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
  // If username is not required, define it like this:
  username: { type: String }, // Remove unique: true if not needed
});


const AdminUser = mongoose.model("AdminUser", AdminUserSchema);



// Register Admin
app.post("/register", async (req, res) => {
  const { name, email, password, contact_number, role } = req.body;

  // Validate input
  if (!name || !email || !password || !contact_number) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingAdminUser = await AdminUser.findOne({ email });
    if (existingAdminUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newAdminUser = new AdminUser({
      name,
      email,
      password: hashedPassword,
      contact_number,
      role: role || "admin", // Default role is "admin" if not provided
      username: email.split("@")[0], // Example: generate username from email
    });

    await newAdminUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch all admin users
app.get("/api/adminusers", async (req, res) => {
  try {
    const users = await AdminUser.find({}, "-password"); // Exclude passwords from the result
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Assuming you have Mongoose set up and a User model
app.get("/api/adminusers/:id", async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id, "-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Send user data as response
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});








// Admin Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the admin exists
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: admin._id, name: admin.name, role: admin.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.log("Decoded token:", decoded);  // Log the decoded token for debugging
    req.user = decoded;  // Attach decoded info to request object
    next();
  });
};


// Protected Admin Route Example
app.get("/dashboard", authenticateToken, (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
});



/******************************************************************/
//*****/ Service Partner**************
//*****************************************************************/

// Service Partner
const ServicePartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: [/.+@.+\..+/, "Please enter a valid email address"] },
  contact_number: { type: String, required: true, match: [/^\d{10}$/, "Contact number must be 10 digits"] },
  service_name: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true, match: [/^\d{6}$/, "Contact number must be 6 digits"] },
});

const ServicePartner = mongoose.model("ServicePartner", ServicePartnerSchema);


// Register Admin
app.post("/servicepartner", async (req, res) => {
  const { name, email, contact_number, service_name, address, area, city, pincode  } = req.body;

  // Validate input
  if (!name || !email || !contact_number || !service_name || !address || !area || !city || !pincode ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingServicePartner = await ServicePartner.findOne({ email });
    if (existingServicePartner) {
      return res.status(400).json({ message: "User already exists" });
    }


    // Create new user
    const newServicePartner= new ServicePartner({
      name,
      email,
      contact_number,
      service_name,
      address,
      area,
      city,
      pincode,
   
    });

    await newServicePartner.save();

    res.status(201).json({ message: "Service Partner registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Fetch all service partners
app.get("/servicepartners", async (req, res) => {
  try {
    const partners = await ServicePartner.find();
    res.status(200).json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a service partner
app.delete("/servicepartner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ServicePartner.findByIdAndDelete(id);
    res.status(200).json({ message: "Service partner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit Partner services
app.put("/servicepartner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedPartner = await ServicePartner.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json(updatedPartner);
  } catch (error) {
    console.error("Error updating partner:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get a single service partner
app.get("/servicepartner/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await ServicePartner.findById(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.status(200).json(partner);
  } catch (error) {
    console.error("Error fetching partner:", error);
    res.status(500).json({ message: "Server error" });
  }
});




/******************************************************************/
//*****/ Payment Gateway**************
//*****************************************************************/

// Payment Schema and Model
const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  mobile: { type: String, required: true }, // Save the mobile number here
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  cartItems: [
    {
      productName: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  datetime: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
  ], // Define the structure of the datetime array
  address: [
    {
    fname: String,
    country: String,
    town: String,
    pincode: String,
    house: String,
  },
 ],// Define the structure of the Address array
  taxesAndFee: { type: Number, default: 0 },
  visitationFee: { type: Number, default: 0 },
  visitingStatus: { type: String, default: "Pending" },
  paymentDetails: mongoose.Schema.Types.Mixed, // Flexible field for payment details
  createdAt: { type: Date, default: Date.now },
});



const Payment = mongoose.model("Payment", paymentSchema);



// Route to save payment and move cart items to bookings
// Save Payment Endpoint
app.post("/api/save-payment", async (req, res) => {
  try {
    const { orderId, userId, totalAmount, paymentStatus, paymentMethod, cartItems, taxesAndFee, visitationFee, paymentDetails, datetime, address, mobile } = req.body;

    if (!orderId || !userId || !totalAmount || !paymentStatus || !paymentMethod || !cartItems || !datetime || !address || !mobile ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create a new payment document
    const newPayment = new Payment({
      orderId,
      userId,
      mobile,
      totalAmount,
      paymentStatus,
      paymentMethod,
      cartItems,
      datetime,
      address,
      taxesAndFee,
      visitationFee,
      paymentDetails,
      createdAt: new Date(),
    });

    // Save to MongoDB
    await newPayment.save();

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



app.get("/api/admin/payment/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Route to get payments for a specific user
app.get("/api/payments/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const payments = await Payment.find({ userId }); // Fetch payments for a specific user
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found for this user." });
    }
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments for user:", error);
    res.status(500).json({ message: "Failed to fetch payments." });
  }
});


// Update visiting status
app.put("/api/payments/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const payment = await Payment.findOneAndUpdate({ orderId }, { visitingStatus: status }, { new: true });

    if (!payment) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Visiting status updated.", payment });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status." });
  }
});




// Delete Payment by Payment ID
app.delete('/api/admin/payments/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Delete the payment with the specified paymentId
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found for the specified ID' });
    }

    res.status(200).json({
      message: 'Payment deleted successfully',
      deletedPayment,
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Failed to delete payment', error });
  }
});







// *********************************************************************
// *****Area Search then show Product list***********/
// *********************************************************************

// Endpoint to search products by city, area, or pincode
app.get("/products/search", async (req, res) => {
  const { location } = req.query; // Renamed 'term' to 'location'

  try {
      // Search for matching service partner based on city, area, or pincode
      const servicePartner = await ServicePartner.findOne({
          $or: [
              { city: { $regex: `^${location}$`, $options: 'i' } }, // Exact match for city name (case-insensitive)
              { area: { $regex: location, $options: 'i' } },         // Partial match for area (if needed)
              { pincode: location }                                  // Exact match for pincode
          ]
      });

      if (!servicePartner) {
          return res.status(404).json({ message: "No service partner found for the specified location" });
      }

      // If a service partner is found, search for products
      const products = await Product.find({
          // Filter products based on the service partner's area, city, or pincode
          $or: [
              { productcategory: { $regex: new RegExp(servicePartner.area, "i") } },
              { productcategory: { $regex: new RegExp(servicePartner.city, "i") } }
          ]
      });

      if (products.length === 0) {
          return res.status(404).json({ message: "No products found for the specified location" });
      }

      res.status(200).json(products);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error" });
  }
});



//**********************************************************************************/
//***********Booking All Summary********************/
//**********************************************************************************/

// Define the BookingSummary schema and model
const BookingSummarySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  mobile: { type: String, required: true }, // Save the mobile number here
  totalAmount: { type: Number, required: true },
  taxesAndFee: { type: Number, required: true },
  visitationFee: { type: Number, required: true },
  cartItems: [
    {
      productName: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  datetime: [
    {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
  address: [
    {
      fname: String,
      country: String,
      town: String,
      pincode: String,
      house: String,
    },
  ],
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  otp: { type: String, required: true },
  visitingStatus: { type: String, default: "Pending" },
  servicePartners: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true, match: [/.+@.+\..+/, "Please enter a valid email address"] },
      contact_number: { type: String, required: true, match: [/^\d{10}$/, "Contact number must be 10 digits"] },
      service_name: { type: String, required: true },
      address: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true, match: [/^\d{6}$/, "Pincode must be 6 digits"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const BookingSummary = mongoose.model('BookingSummary', BookingSummarySchema);





// Route to save booking summary and send OTP and messages
app.post("/api/save-booking-summary", async (req, res) => {
  try {
    const bookingData = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const address = bookingData.address[0];
    const { town: city, pincode } = address;

    // Find matching service partners
    const matchingPartners = await ServicePartner.find({ city, pincode });
    if (matchingPartners.length === 0) {
      return res.status(400).json({ message: "No service partners found." });
    }
    const selectedServicePartner = matchingPartners[0];

    // Prepare messages
    const servicePartnerMessage = `
      New Booking Received:
      Order ID: ${bookingData.orderId}.
      Customer Details: 
      Name: ${address.fname}, 
      Contact: ${bookingData.mobile}, 
      Address: ${address.house}, ${city}, ${pincode}.
      Verify Booking: http://localhost:3000/verify-booking/${bookingData.orderId}.
    `;

    const userMessage = `
      Your booking is confirmed:
      Order ID: ${bookingData.orderId}.
      Service Partner: ${selectedServicePartner.name}, 
      Contact: ${selectedServicePartner.contact_number}.
      OTP for verification: ${otp}.
    `;

    // Send SMS
    await sendSms(bookingData.mobile, userMessage);
    await sendSms(selectedServicePartner.contact_number, servicePartnerMessage);

    // Save booking
    const newBookingSummary = new BookingSummary({
      orderId: bookingData.orderId,
      userId: bookingData.userId,
      mobile:bookingData.mobile,
      totalAmount: bookingData.totalAmount,
      taxesAndFee: bookingData.taxesAndFee,
      visitationFee: bookingData.visitationFee,
      cartItems: bookingData.cartItems,
      datetime: bookingData.datetime,
      address: bookingData.address,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentStatus,
      otp,
      visitingStatus: "In Process",
      servicePartners: [{
        name: selectedServicePartner.name,
        email: selectedServicePartner.email,
        contact_number: selectedServicePartner.contact_number,
        service_name: selectedServicePartner.service_name,
        address: selectedServicePartner.address,
        area: selectedServicePartner.area,
        city: selectedServicePartner.city,
        pincode: selectedServicePartner.pincode,
      }],
    });

    await newBookingSummary.save();
    res.status(200).json({ message: "Booking saved and OTP sent successfully." });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Failed to save booking.", error: error.message });
  }
});





// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Twilio Client Initialization
const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);


// Function to send SMS
const sendSms = async (to, message) => {
  try {
    // Ensure the phone number is in E.164 format
    const sanitizedTo = to.startsWith("+") ? to : `+91${to.trim()}`; // Add +91 if not already present

    await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, // Use Messaging Service SID
      to: sanitizedTo,
      body: message,
    });
    console.log(`SMS sent to ${sanitizedTo}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error.message);
  }
};




// Example route for testing
app.post("/send-otp", async (req, res) => {
  const { mobile, message } = req.body;

  try {
    await sendSms(mobile, message);
    res.status(200).json({ success: true, message: "SMS sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Verify booking and update status
// app.post("/api/verify-booking", async (req, res) => {
//   const { orderId, otp } = req.body;

//   try {
//     const booking = await BookingSummary.findOne({ orderId });

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found." });
//     }

//     if (booking.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP." });
//     }

//     booking.visitingStatus = "Completed";
//     await booking.save();

//     res.status(200).json({ message: "Booking verified and status updated." });
//   } catch (error) {
//     console.error("Error verifying booking:", error);
//     res.status(500).json({ message: "Failed to verify booking.", error: error.message });
//   }
// });

app.post("/api/verify-booking", async (req, res) => {
  const { orderId, otp } = req.body;

  try {
    const booking = await BookingSummary.findOne({ orderId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // BookingSummary mein status update kare
    booking.visitingStatus = "Completed";
    await booking.save();

    // Payment collection mein bhi status update kare
    const updatedPayment = await Payment.findOneAndUpdate(
      { orderId },
      { visitingStatus: "Completed" },
      { new: true }
    );

    if (!updatedPayment) {
      console.warn(`Payment record not found for orderId: ${orderId}`);
    }

    res.status(200).json({ message: "Booking verified and status updated in both collections." });
  } catch (error) {
    console.error("Error verifying booking:", error);
    res.status(500).json({ message: "Failed to verify booking.", error: error.message });
  }
});




// Route to get all booking summaries
app.get("/api/all-booking-summaries", async (req, res) => {
  try {
    const bookings = await BookingSummary.find().populate("servicePartners");
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
  }
});



//view page 
app.get("/api/all-booking-summaries/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await BookingSummary.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking summary not found" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});






// after pending button click visiting status
app.post("/api/update-order-status", async (req, res) => {
  const { orderId } = req.body;

  try {
    // Order ko find karke status update kare
    const updatedOrder = await Payment.findOneAndUpdate(
      { orderId }, 
      { visitingStatus: "In Process" },
      { new: true }  // Yeh ensure karega ki updated document return ho
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete Payment by Payment ID
app.delete('/api/all-booking-summaries/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    console.log("Deleting booking with ID:", bookingId);

    const deletedBooking = await BookingSummary.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error("Error deleting Booking:", error);
    res.status(500).json({ message: 'Failed to delete Booking', error });
  }
});



//**********Dashboard**************

// Assuming you have already defined and imported your Payment model:
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const totalOrders = await Payment.countDocuments();
    const completedOrders = await Payment.countDocuments({ visitingStatus: "Completed" });
    const inProcessOrders = await Payment.countDocuments({ visitingStatus: "In Process" });
    const canceledOrders = await Payment.countDocuments({ visitingStatus: "Canceled" });
    const pendingOrders = await Payment.countDocuments({ visitingStatus: "Pending" });
    const totalCustomers = await User.countDocuments();
    const totalServicePartner = await ServicePartner.countDocuments();
    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" }
        }
      }
    ]);

    // If no documents found, totalAmount is 0
    const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

     // Aggregation to calculate total amount per visiting status (for Completed, In Process, and Pending)
     const statusAmounts = await Payment.aggregate([
      {
        $match: { visitingStatus: { $in: ["Completed", "In Process", "Pending", "Canceled"] } }
      },
      {
        $group: {
          _id: "$visitingStatus",
          statusTotal: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Convert aggregation result to an object for easier access
    const statusTotals = {
      Completed: 0,
      "In Process": 0,
      Pending: 0,
      Canceled:0,
    };
    
    statusAmounts.forEach((group) => {
      statusTotals[group._id] = group.statusTotal;
    });

    res.status(200).json({
      totalOrders,
      completedOrders,
      inProcessOrders,
      canceledOrders,
      pendingOrders,
      totalCustomers,
      totalServicePartner,
      totalAmount,
      // Total amount for each visiting status
      completedAmount: statusTotals["Completed"],
      inProcessAmount: statusTotals["In Process"],
      pendingAmount: statusTotals["Pending"],
      canceledAmount:statusTotals["Canceled"]
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
});



//******************* */ Monthly Report********************

app.get('/api/monthly-report', async (req, res) => {
  try {
    const report = await Payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "Completed"] }, 1, 0] }
          },
          inProcessOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "In Process"] }, 1, 0] }
          },
          canceledOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "Canceled"] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$visitingStatus", "Pending"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalOrders: 1,
          totalAmount: 1,
          completedOrders: 1,
          inProcessOrders: 1,
          canceledOrders: 1,
          pendingOrders: 1
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    // Optionally, round totalAmount values to two decimals
    const roundedReport = report.map(item => ({
      ...item,
      totalAmount: Math.round(item.totalAmount * 100) / 100
    }));

    res.status(200).json({ report: roundedReport });
  } catch (error) {
    console.error("Error generating monthly report:", error);
    res.status(500).json({ message: "Failed to generate monthly report", error: error.message });
  }
});








// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> c255c55 (Initial commit)
