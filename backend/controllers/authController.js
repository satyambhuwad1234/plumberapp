require("dotenv").config(); // Load environment variables from .env file
const User = require("../models/User");

const twilio = require('twilio');  // Import Twilio SDK

// Initialize Twilio client with SID and Auth Token



//const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;



const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOtp = async (req, res) => {
    const { mobile } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    try {
        // Check if user exists
        let user = await User.findOne({ mobile });
        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({ mobile });
        }

        // Save OTP and expiry time to the database
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${mobile}`, // Replace `+91` with your country code if needed
        });

        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};



exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        // Find the user with the given mobile number
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the OTP is correct and not expired
        if (user.otp !== otp || new Date() > user.otpExpiresAt) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Clear OTP and expiry time after successful verification
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully", user });
    } catch (error) {
        console.error("Error verifying OTP:", error.message);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
};
