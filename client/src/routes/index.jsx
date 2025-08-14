import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Landingpage from "../pages/Landingpage.jsx";
import JoyLoops from "../Components/JoyLoops/Joyloop.jsx";
import UserProfile from "../pages/UserProfile.jsx";
import SettingsPage from "../pages/Settings.jsx";
import ImpactReportPage from "../pages/ImpactReport.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import DonationMap from "../pages/HeatMap.jsx";
import DeliveryTimeline from "../pages/DeliveryTimeline.jsx";
import DonationForm from "../Components/MainPage/NewDonation.jsx";
import DonateMoney from "../pages/DonateMoney"; // Create this page
import AdminDashboard from "../pages/AdminDashboard.jsx";
import DonationList from "../pages/DonationListing.jsx";
import FoodDonationRequestForm from "../Components/ui/RequestForm.jsx";
import ChatbotWidget from "../Components/ui/ChatbotUI.jsx";
import FeedDaily from "../pages/FeedDaily.jsx";
import ReliefCamps from "../pages/Reliefcamp.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/joyloop" element={<JoyLoops />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/impact" element={<ImpactReportPage />} />
        <Route path="/onboard" element={<Onboarding />} />
        <Route path="/map" element={<DonationMap />} />
        <Route path="/orderstatus" element={<DeliveryTimeline  currentStep={5}/>} />
        <Route path="/donate" element={<DonationForm/>} />
        <Route path="/donatemoney" element={<DonateMoney />} />
        <Route path="/Listings" element={<DonationList  /> } /> 
        <Route path="/request" element={<FoodDonationRequestForm/>} />
        <Route path="/chat" element={<ChatbotWidget/>} />
        <Route path="/recurring" element={<FeedDaily />} />
        <Route path="/relief" element={<ReliefCamps/>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <Dashboard />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
