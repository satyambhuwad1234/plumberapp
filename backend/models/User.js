const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
});


module.exports = mongoose.model("User", userSchema);
