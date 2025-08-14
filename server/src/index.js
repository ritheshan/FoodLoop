import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
// import { Server } from 'socket.io';
import connectDB from "./utils/db.connect.js";
// import "./jobs/matchListingsJob.js";
import cron from "node-cron";
import { triggerScheduledDonations } from "./controllers/recurring.controller.js";
// Importing Routes
import authRoutes from "./routes/auth.routes.js";
import donationRoutes from "./routes/donations.routes.js";
import moneyDonationRoutes from "./routes/moneyDonation.routes.js";
import ngoRoutes from "./routes/ngo.routes.js";
import transactionRoutes from "./routes/transactions.routes.js";
import impactRoutes from "./routes/impact.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import joyloopRoutes from "./routes/joyloop.routes.js";
import requestRoutes from "./routes/request.routes.js";
import recurringRoutes from "./routes/recurring.routes.js";
import packRoutes from "./routes/pack.routes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true, // if you use cookies or auth
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/joyloop", joyloopRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/pack", packRoutes);
app.use("/api/money-donations", moneyDonationRoutes);


// Real-time Donation Tracking
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('newDonation', (donation) => {
//         io.emit('updateDonations', donation);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// **Connect to MongoDB using connectDB function**
connectDB();

// Server Listener

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// runs every 10 am
cron.schedule('0 10 * * *', () => {
  console.log('⏰ Running donation scheduler...');
  triggerScheduledDonations();
});
