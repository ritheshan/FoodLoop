import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DonateMoney() {
  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: ""
  });

  // State for donors list
  const [donors, setDonors] = useState([
    { name: "Priya Sharma", amount: 2500 },
    { name: "Raj Malhotra", amount: 1000 },
    { name: "Ananya Patel", amount: 5000 },
    { name: "Vikram Singh", amount: 3500 },
    { name: "Neha Gupta", amount: 1500 },
    { name: "Arjun Reddy", amount: 2000 },
    { name: "Meera Joshi", amount: 750 },
    { name: "Karan Kapoor", amount: 4000 }
  ]);

  // Loading and payment states
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission and payment
  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create order on backend
      const orderResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/money-donations/create-order`, {
        amount: formData.amount,
        name: formData.name,
        email: formData.email
      });
      
      const { orderId , key , donationId } = orderResponse.data;
      console.log("Order ID:", orderId);
      console.log("Donation ID:", donationId);

      // Step 2: Initialize Razorpay
      const options = {
        key: key,
        amount: formData.amount * 100, // Razorpay amount in paise
        currency: "INR",
        name: "FoodLoop Donation",
        description: "Donation to help fight hunger",
        order_id: orderId,
        handler: function(response) {
          // Step 3: Verify payment on backend
          verifyPayment(response,donationId);
        },
        prefill: {
          name: formData.name,
          email: formData.email
        },
        theme: {
          color: "#FFA725"
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response){
  axios.post(`${import.meta.env.VITE_BACKEND_API}/api/money-donations/fail-payment`, {
    donationId: donationId,
    reason: response.error.reason
  });
});

razorpay.on('checkout.dismiss', function(){
      console.log('Checkout dismissed callback triggered');

  axios.post(`${import.meta.env.VITE_BACKEND_API}/api/money-donations/fail-payment`, {
    donationId: donationId,
    reason: 'User closed checkout'
  });
});
      razorpay.open();
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Payment initiation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify payment with backend
  const verifyPayment = async (paymentResponse, donationId) => {
    try {
        console.log("donaton id",donationId)
      const verifyResponse = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/money-donations/verify-payment`, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        amount: formData.amount,
        name: formData.name,
        email: formData.email,
        donationId: donationId
      });

      if (verifyResponse.data.success) {
        setPaymentSuccess(true);
        
        // Add donor to list for immediate feedback
        const newDonor = { 
          name: formData.name, 
          amount: parseInt(formData.amount) 
        };
        setDonors(prevDonors => [newDonor, ...prevDonors]);
        
        // Reset form
        setFormData({ name: "", email: "", amount: "" });
        
        // Hide success message after 5 seconds
        setTimeout(() => setPaymentSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      
    }
  };

  // Fetch actual donors from backend
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/money-donations/recent-donors`);
        if (response.data.donors && response.data.donors.length > 0) {
          setDonors(response.data.donors);
        }
      } catch (error) {
        console.error("Failed to fetch donors:", error);
      }
    };

    fetchDonors();
    
    // Add Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-colour1 to-colour2 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-merriweather font-bold text-white mb-4">
            Support Our Mission
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Your donation helps us combat food waste and hunger by connecting surplus food with those who need it most.
          </p>
        </div>

        {/* Top section - Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left column - Donation form */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-colour4 mb-6 font-merriweather">Make a Donation</h2>
            
            {paymentSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                Thank you for your generous donation! Your contribution will make a difference.
              </div>
            )}
            
            <form onSubmit={handleDonate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-colour1 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-colour1 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Donation Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="100"
                    className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-colour1 focus:border-transparent"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[500, 1000, 2000, 5000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData({...formData, amount: amount.toString()})}
                      className="px-3 py-1 bg-colour3 bg-opacity-20 hover:bg-opacity-30 rounded-full text-sm text-colour4 font-medium transition-colors"
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={loading} 
                className="w-full bg-colour1 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {loading ? "Processing..." : "Donate Now"}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Secured by Razorpay. Your payment information is encrypted and secure.
              </p>
            </form>
          </div>
          
          {/* Right column - Info panel */}
          <div className="bg-colour2 rounded-lg shadow-md p-6 md:p-8 border border-colour3 border-opacity-30">
            <h3 className="text-xl font-semibold text-colour4 mb-4 font-merriweather">About Our Donation Fund</h3>
            
            <p className="text-gray-700 mb-4">
              This fund is going to the FoodLoop owner, who by non-repudiation will distribute it to needy NGOs or social work.
            </p>
            
            <p className="text-gray-700 mb-4">
              In the future, the payment gateway will allow direct payments to trusted NGOs.
            </p>
            
            <div className="mt-8 bg-white p-6 rounded-md border border-colour3 border-opacity-30">
              <h4 className="font-medium text-colour4 mb-4 font-merriweather">How Your Donation Helps</h4>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-colour1 mt-1"></div>
                  <div className="ml-3">
                    <p className="text-gray-700">Provides <strong>meals to those in need</strong>, including children, elderly, and homeless individuals</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-colour1 mt-1"></div>
                  <div className="ml-3">
                    <p className="text-gray-700">Supports <strong>local food distribution programs</strong> that connect surplus food with hungry people</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-colour1 mt-1"></div>
                  <div className="ml-3">
                    <p className="text-gray-700">Reduces <strong>food waste</strong> in the community by redirecting excess food from restaurants and events</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-colour1 mt-1"></div>
                  <div className="ml-3">
                    <p className="text-gray-700">Creates <strong>sustainable food networks</strong> that help ensure consistent access to nutrition</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - Donor highlights */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-semibold text-colour4 mb-8 font-merriweather text-center">
            Our Generous Donors
          </h2>
          
          {/* Row 1: Left to right scroll */}
          <div className="overflow-hidden mb-10">
            <div className="flex animate-scroll-left">
              {/* Doubled array for smooth looping */}
              {[...donors, ...donors].map((donor, idx) => (
                <div 
                  key={`left-${idx}`}
                  className="flex-shrink-0 bg-colour2 border border-colour3 border-opacity-20 rounded-lg shadow-sm p-4 mx-2 w-64"
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-colour1 bg-opacity-20 flex items-center justify-center text-colour1 font-bold text-lg">
                      {donor.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{donor.name}</p>
                      <p className="text-colour1 font-semibold">₹{donor.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2: Right to left scroll */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-right">
              {/* Doubled and reversed array for smooth looping */}
              {[...donors, ...donors].reverse().map((donor, idx) => (
                <div 
                  key={`right-${idx}`}
                  className="flex-shrink-0 bg-colour2 border border-colour3 border-opacity-20 rounded-lg shadow-sm p-4 mx-2 w-64"
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-colour1 bg-opacity-20 flex items-center justify-center text-colour1 font-bold text-lg">
                      {donor.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{donor.name}</p>
                      <p className="text-colour1 font-semibold">₹{donor.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* UPI Payment Option */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
          <h3 className="text-xl font-semibold text-colour4 mb-4 font-merriweather">Pay Directly via UPI</h3>
          <p className="text-gray-700 mb-6">
            Scan the QR code or use our UPI ID to make a direct donation
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="bg-colour2 p-4 rounded-lg border border-colour3 border-opacity-30 max-w-xs">
              <div className="w-48 h-48 bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                {/* This would be replaced with an actual QR code image */}
                <span className="text-gray-500">QR Code Placeholder</span>
              </div>
              <p className="text-sm text-gray-600">Scan to pay directly</p>
            </div>
            
            <div>
              <div className="bg-colour2 p-4 rounded-lg border border-colour3 border-opacity-30 mb-4">
                <p className="text-sm text-gray-600 mb-1">UPI ID:</p>
                <p className="font-medium text-colour4 text-lg">foodloop@upi</p>
              </div>
              
              <div className="flex gap-2 justify-center">
                <img src="/gpay-icon.png" alt="Google Pay" className="h-8 w-8 object-contain opacity-70 hover:opacity-100" />
                <img src="/phonepe-icon.png" alt="PhonePe" className="h-8 w-8 object-contain opacity-70 hover:opacity-100" />
                <img src="/paytm-icon.png" alt="Paytm" className="h-8 w-8 object-contain opacity-70 hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}