import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createFoodRequest } from "../../services/dashboardService";
import SubmittedForm from "./SubmittedForm";
const FoodDonationRequestForm = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    forSomeoneElse: false,
    organizationName: "",
    contactPerson: "",
    // address: user.fullAddress || "",
    // phone: user.contactNumber || "",
    requestType: "general",
    specialOccasion: "",
    celebrationName: "",
    itemsNeeded: "",
    urgencyLevel: "standard",
    additionalNotes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createFoodRequest2 = await createFoodRequest(formData);
    if (createFoodRequest2.error) {
      toast.error("Error submitting request. Please try again.");
    } else {
      setIsSubmitted(true);
      console.log("Form submitted:", formData);
      toast.success("Food donation request submitted successfully!");
    }
  };

  return !isSubmitted ? (
    <div className="flex justify-center items-center p-6">
      <div className="relative max-w-md w-full overflow-hidden rounded-lg">
        {/* Container for the form with fixed dimensions */}
        <div className="relative bg-white border border-transparent rounded-lg shadow-lg">
          {/* Animated border elements positioned absolutely */}
          <div className="absolute top-0 left-0 w-full h-1 z-10">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-500 opacity-70 animate-border-beam-x"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 z-10">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500 opacity-70 animate-border-beam-x-reverse"></div>
          </div>
          <div className="absolute top-0 left-0 h-full w-1 z-10">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-500 opacity-70 animate-border-beam-y"></div>
          </div>
          <div className="absolute top-0 right-0 h-full w-1 z-10">
            <div className="absolute bottom-0 right-0 w-full h-1/3 bg-blue-500 opacity-70 animate-border-beam-y-reverse"></div>
          </div>

          <form className="flex flex-col gap-4 p-6" onSubmit={handleSubmit}>
            <div className="flex items-center">
              <div className="relative w-6 h-6 mr-2">
                <span className="absolute inset-0 bg-blue-600 rounded-full"></span>
                <span className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></span>
              </div>
              <h2 className="text-2xl font-bold text-blue-600">
                Food Donation Request
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Request food donations quickly and easily.
            </p>

            <div className="relative flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="forSomeoneElse"
                name="forSomeoneElse"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.forSomeoneElse}
                onChange={handleChange}
              />
              <label htmlFor="forSomeoneElse" className="text-sm text-gray-700">
                I'm requesting this donation for an organization
              </label>
            </div>

            {formData.forSomeoneElse && (
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                      placeholder=" "
                      value={formData.organizationName}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="organizationName"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                    >
                      Organization Name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                      placeholder=" "
                      value={formData.contactPerson}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="contactPerson"
                      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                    >
                      Contact Person
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                    placeholder=" "
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="address"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                  >
                    Address*
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                  >
                    Phone Number*
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  id="requestType"
                  name="requestType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6 "
                  value={formData.requestType}
                  onChange={handleChange}
                  required
                >
                  <option value="general">General Request</option>
                  <option value="emergency">Emergency Relief</option>
                  <option value="event">Community Event</option>
                  <option value="ongoing">Ongoing Program</option>
                </select>
                <label
                  htmlFor="requestType"
                  className="absolute text-sm transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 text-blue-600"
                >
                  Request Type*
                </label>
              </div>

              {/* Special occasion section with conditional name field */}
              <div className="relative">
                <input
                  type="text"
                  id="specialOccasion"
                  name="specialOccasion"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                  placeholder=" "
                  value={formData.specialOccasion}
                  onChange={handleChange}
                />
                <label
                  htmlFor="specialOccasion"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                >
                  Special Occasion (Birthday, etc.)
                </label>
              </div>

              {/* Conditional name field that appears when specialOccasion has a value */}
              {formData.specialOccasion && (
                <div className="relative">
                  <input
                    type="text"
                    id="celebrationName"
                    name="celebrationName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                    placeholder=" "
                    value={formData.celebrationName || ""}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="celebrationName"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
                  >
                    Name for the {formData.specialOccasion}
                  </label>
                </div>
              )}
            </div>

            <div className="relative">
              <textarea
                id="itemsNeeded"
                name="itemsNeeded"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                placeholder=" "
                rows="3"
                value={formData.itemsNeeded}
                onChange={handleChange}
                required
              ></textarea>
              <label
                htmlFor="itemsNeeded"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
              >
                Food Items Needed (Please list specific items)*
              </label>
            </div>

            <div className="relative">
              <select
                id="urgencyLevel"
                name="urgencyLevel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                value={formData.urgencyLevel}
                onChange={handleChange}
                required
              >
                <option value="standard">
                  Standard - Same day (by end of day)
                </option>
                <option value="priority">Priority - Within 4 hours</option>
                <option value="express">Express - Within 2 hours</option>
                <option value="urgent">Urgent - Within 1 hour</option>
              </select>
              <label
                htmlFor="urgencyLevel"
                className="absolute text-sm transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 text-blue-600"
              >
                Delivery Time*
              </label>
            </div>

            <div className="relative">
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer pt-6"
                placeholder=" "
                rows="2"
                value={formData.additionalNotes}
                onChange={handleChange}
              ></textarea>
              <label
                htmlFor="additionalNotes"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-600"
              >
                Additional Notes or Requirements
              </label>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Submit Request
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes border-beam-x {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
        @keyframes border-beam-x-reverse {
          0% {
            transform: translateX(300%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        @keyframes border-beam-y {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(300%);
          }
        }
        @keyframes border-beam-y-reverse {
          0% {
            transform: translateY(300%);
          }
          100% {
            transform: translateY(-100%);
          }
        }
        .animate-border-beam-x {
          animation: border-beam-x 4s infinite linear;
        }
        .animate-border-beam-x-reverse {
          animation: border-beam-x-reverse 4s infinite linear;
        }
        .animate-border-beam-y {
          animation: border-beam-y 4s infinite linear;
        }
        .animate-border-beam-y-reverse {
          animation: border-beam-y-reverse 4s infinite linear;
        }
      `}</style>
    </div>
  ) : (
    <>
      <SubmittedForm />
    </>
  );
};

export default FoodDonationRequestForm;
