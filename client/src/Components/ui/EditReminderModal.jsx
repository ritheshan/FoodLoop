import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { getAuthToken } from "../../services/dashboardService";
import { X, Save, Calendar, Archive, Clock, Scale, Pizza } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_API;

const EditReminderModal = ({ reminder, onClose, onUpdated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      foodType: reminder.foodType,
      storage: reminder.storage,
      frequency: reminder.frequency,
      startDate: new Date(reminder.startDate).toISOString().split("T")[0],
      weight: reminder.weight,
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`${API_URL}/api/recurring/update/${reminder._id}`, data, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      console.log("after the fetch call", res.data);

      if (typeof onUpdated === "function") {
        onUpdated(); // Refresh reminders list
      }
      onClose(); // Close modal
    } catch (err) {
      console.error("Failed to update reminder:", err);
    }
  };

  const getStorageColor = (storageType) => {
    const colors = {
      "room temp": "bg-amber-100 text-amber-800",
      refrigerated: "bg-blue-100 text-blue-800",
      frozen: "bg-indigo-100 text-indigo-800",
    };
    return colors[storageType] || "bg-gray-100 text-gray-800";
  };

  const getFrequencyColor = (frequency) => {
    const colors = {
      Daily: "bg-red-100 text-red-800",
      Weekly: "bg-green-100 text-green-800",
      Monthly: "bg-purple-100 text-purple-800",
      Custom: "bg-blue-100 text-blue-800",
    };
    return colors[frequency] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">Edit Reminder</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Food type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Pizza size={16} className="mr-2" />
                Food Type
              </label>
              <input
                {...register("foodType", { required: "Food type is required" })}
                placeholder="e.g. Fruits, Vegetables, Dairy"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {errors.foodType && (
                <p className="text-red-600 text-sm">
                  {errors.foodType.message}
                </p>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Scale size={16} className="mr-2" />
                Weight
              </label>
              <input
                {...register("weight")}
                placeholder="e.g. 2kg, 500g"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Two columns layout for storage and frequency */}
            <div className="grid grid-cols-2 gap-4">
              {/* Storage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Archive size={16} className="mr-2" />
                  Storage
                </label>
                <select
                  {...register("storage")}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                >
                  <option value="room temp">Room Temp</option>
                  <option value="refrigerated">Refrigerated</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Clock size={16} className="mr-2" />
                  Frequency
                </label>
                <select
                  {...register("frequency")}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none bg-white"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <Calendar size={16} className="mr-2" />
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Preview Cards */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Preview
              </h3>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStorageColor(
                    reminder.storage
                  )}`}
                >
                  {reminder.storage}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getFrequencyColor(
                    reminder.frequency
                  )}`}
                >
                  {reminder.frequency}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditReminderModal;
