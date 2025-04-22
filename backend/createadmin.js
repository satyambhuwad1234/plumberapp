<<<<<<< HEAD
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminUser = require("./models/AdminUser");

mongoose.connect("mongodb://localhost:27017/carbook", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to the database");

        const username = "admin";
        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new AdminUser({ username, password: hashedPassword });

        await admin.save();
        console.log("Admin user created:", admin);
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });
=======
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminUser = require("./models/AdminUser");

mongoose.connect("mongodb://localhost:27017/carbook", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to the database");

        const username = "admin";
        const password = "admin123";

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new AdminUser({ username, password: hashedPassword });

        await admin.save();
        console.log("Admin user created:", admin);
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });
>>>>>>> c255c55 (Initial commit)
