import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthToken } from "../../services/dashboardService";
import { motion } from "framer-motion";
import { Clock, Calendar, Check, AlertCircle } from "lucide-react";
import EditReminderModal from "./EditReminderModal";

const API_URL = import.meta.env.VITE_BACKEND_API;

const ExistingReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);
  
  const fetchExistingReminder = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recurring/existing`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      setReminders(response?.data?.recurs || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
      setError("Failed to load reminders");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExistingReminder();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-t-4  border-solid rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Loading reminders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md max-w-md">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl">
      {editingReminder && (
        <EditReminderModal
          reminder={editingReminder}
          onClose={() => setEditingReminder(null)}
          onUpdated={fetchExistingReminder}
        />
      )}
      
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Reminders</h2>

      {reminders && reminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reminders.map((reminder, index) => (
            <motion.div
              key={reminder._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`h-2 ${getFoodTypeColor(reminder.foodType)}`}
              ></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {reminder.foodType}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getFrequencyColor(
                      reminder.frequency
                    )}`}
                  >
                    {reminder.frequency}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2" size={18} />
                    <span>
                      Next:{" "}
                      {new Date(reminder.nextScheduled).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2" size={18} />
                    <span>{formatFrequencyText(reminder.frequency)}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 rounded-md bg-blue-50 text-amber-700 hover:bg-amber-800 transition-colors duration-200 text-sm font-medium"
                    onClick={() => setEditingReminder(reminder)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Calendar className="text-gray-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No reminders found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md">
            You don't have any reminders set up yet. Create your first reminder
            to get started.
          </p>
          <button className="px-6 py-3 bg-colour1 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 flex items-center">
            <Check className="mr-2" size={18} />
            Create Reminder
          </button>
        </motion.div>
      )}
    </div>
  );
};

// Helper functions for dynamic styling
function getFoodTypeColor(foodType) {
  const colors = {
    Fruits: "bg-green-500",
    Vegetables: "bg-emerald-500",
    Dairy: "bg-blue-400",
    Meat: "bg-red-500",
    Grains: "bg-amber-500",
    Snacks: "bg-purple-500",
  };

  return colors[foodType] || "bg-gray-500";
}

function getFrequencyColor(frequency) {
  const colors = {
    Daily: "bg-red-100 text-red-800",
    Weekly: "bg-blue-100 text-blue-800",
    Monthly: "bg-green-100 text-green-800",
    Custom: "bg-purple-100 text-purple-800",
  };

  return colors[frequency] || "bg-gray-100 text-gray-800";
}

function formatFrequencyText(frequency) {
  switch (frequency) {
    case "Daily":
      return "Recurring every day";
    case "Weekly":
      return "Recurring every week";
    case "Monthly":
      return "Recurring every month";
    case "Custom":
      return "Custom schedule";
    default:
      return frequency;
  }
}

export default ExistingReminders;