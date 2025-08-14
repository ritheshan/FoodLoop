import googleapis from 'googleapis';
const { google } = googleapis;
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import {uploadToCloudinary } from '../utils/cloudinary.js';  // Adjust the path as needed
import {upload} from '../middleware/multerConfig.js';  
dotenv.config()
export const signup = async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    const { name, email, password, role, googleId } = req.body;

    if (!name || !email || (!password && !googleId) || (!role && !googleId)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const {
      organizationName,
      contactNumber,
      address,
      website,
      location,
      foodPreferences,
      needsVolunteer,
      certificates,
      foodTypes,
      walletAddress,
      volunteerInterests,
      associatedNGO,
    } = req.body;

    // If user is a donor or NGO and has certificates, handle the file upload
    if ((role === 'donor' || role === 'NGO') && req.files && req.files.length > 0) {
      // Upload files to uploadToCloudinary 
      const certificateUrls = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary.uploader.upload(file.path);
        certificateUrls.push(result.secure_url);
      }
      
      // Add the certificate URLs to the user data
      req.body.certificates = certificateUrls;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    // If user exists and it's a Google user who hasn't completed onboarding
    if (existingUser && existingUser.googleId && !existingUser.profileCompleted) {
      Object.assign(existingUser, {
        name,
        role,
        profileCompleted: true,
        ...(organizationName && { organizationName }),
        ...(contactNumber && { contactNumber }),
        ...(address && { address }),
        ...(website && { website }),
        ...(location && { location }),
        ...(role === 'donor' && { foodTypes, walletAddress, certificates: req.body.certificates }),
        ...(role === 'NGO' && { foodPreferences, needsVolunteer, certificates: req.body.certificates }),
        ...(role === 'volunteer' && { volunteerInterests, associatedNGO }),
      });

      await existingUser.save();
      return res.status(200).json({ success: true, message: "Google user profile updated" });
    }

    // If user exists and is not a Google user, block
    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please log in." });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      role,
      googleId,
      profileCompleted: true,
      ...(organizationName && { organizationName }),
      ...(contactNumber && { contactNumber }),
      ...(address && { address }),
      ...(website && { website }),
      ...(location && { location }),
      ...(role === 'donor' && { foodTypes, walletAddress, certificates: req.body.certificates }),
      ...(role === 'NGO' && { foodPreferences, needsVolunteer, certificates: req.body.certificates }),
      ...(role === 'volunteer' && { volunteerInterests, associatedNGO }),
    };

    const user = new User(userData);
    await user.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};


const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Get Google Auth URL
export const getGoogleAuthURL = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: "consent",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI, // ✅ Required!
  });

  res.json({ url });
};

// Step 2: Google OAuth callback
export const handleGoogleCallback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: "No code provided" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: googleUser } = await oauth2.userinfo.get();
    console.log("Google User Data:", googleUser);

    let user = await User.findOne({ email: googleUser.email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        // name: googleUser.email.split('@')[0] + "_" + Math.floor(Math.random() * 10000),
        name : googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        googleId: googleUser.id,
        authProvider: "google",
        profileCompleted: false, // 👈 forces onboarding flow
        role: null            // 👈 role will be selected in onboarding
      });
    } else {
      user.googleId = googleUser.id;
      user.authProvider = "google";
      user.avatar = googleUser.picture;
    }

    await user.save();

    const jwtToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      jwt: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        googleId: user.googleId,
        profileCompleted: user.profileCompleted,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error.message
    });
  }
};

