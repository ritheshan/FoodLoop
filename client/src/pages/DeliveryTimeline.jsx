import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  ChevronRight, 
  Award, 
  Search,
  Calendar,
  Filter,
  ArrowDownUp,
  Package
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FoodDistributionSidebar } from "../Components/MainPage/Sidebar";
import TimelineModal from "../Components/MainPage/TimelineModel"; // Adjust path as needed

// Wherever your statusLabels object is defined
const statusLabels = {
  requested: "Requested",
  processing: "Processing",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  delivered: "Delivered",
  confirmed: "Confirmed",
  on_chain: "Verified on Blockchain", // Add this line
  // any other statuses you have...
};

// Status colors for visual indicators
const statusColors = {
  'pending': 'bg-yellow-500',
  'requested': 'bg-blue-500',
  'picked_up': 'bg-purple-500',  
  'in_transit': 'bg-orange-500',
  'delivered': 'bg-teal-500',
  'confirmed': 'bg-green-500'
};

const TransactionsList = () => {
  const navigate = useNavigate();
  const { token, hasRole, user , authLoading } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Add these missing state variables
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  
  // Get user's role
  const userRole = hasRole('admin') ? 'admin' : 
                  hasRole('ngo') ? 'ngo' : 
                  hasRole('volunteer') ? 'volunteer' : 
                  hasRole('donor') ? 'donor' : null;
  
  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Fetch transactions from API
  useEffect(() => {
    if (authLoading) return; // wait for auth to load
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const endpoint = `${import.meta.env.VITE_BACKEND_API}/api/transaction/user`; // no userId in URL

        console.log("API Endpoint:", endpoint);
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Fetched transactions:', data);
        setTransactions(data); // No need for data.orders, your backend returns an array
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message || "Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };
    console.log("Token:", token);
    console.log("User ID:", user?.id);
    // fetchTransactions();
    if (!authLoading && token && user?.id) {
      fetchTransactions();
    }
  }, [ authLoading , token, user?.id]);
  
  // Handle sort toggle
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Process and filter/sort transactions
  const processedTransactions = () => {
    if (!transactions.length) return [];
    
    return transactions
      // Filter by search term
      .filter(transaction => {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.id.toString().includes(searchLower) ||
          (transaction.foodType && transaction.foodType.toLowerCase().includes(searchLower)) ||
          (transaction.recipient && transaction.recipient.toLowerCase().includes(searchLower)) ||
          (transaction.donor && transaction.donor.toLowerCase().includes(searchLower))
        );
      })
      // Filter by status
      .filter(transaction => {
        if (filterStatus === "all") return true;
        return transaction.status === filterStatus;
      })
      // Sort by selected field
      .sort((a, b) => {
        let comparison = 0;
        
        if (sortField === "date") {
          comparison = new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
        } else if (sortField === "id") {
          comparison = a.id.localeCompare(b.id);
        } else if (sortField === "status") {
          const statusOrder = ['pending', 'requested', 'picked_up', 'in_transit', 'delivered', 'confirmed'];
          comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        }
        
        return sortDirection === "asc" ? comparison : -comparison;
      });
  };
  
  // Navigate to transaction details
  const handleViewTransaction = async (transactionId) => {
    if (!transactionId) {
      console.log('No transaction ID provided');
      return;
    }
  
    try {
      setTimelineLoading(true);
      setTimelineError(null);
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/transaction/orders/${transactionId}/timeline`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Timeline data:', data);
  
      // Set timeline data to state
      setTimeline(data.events || []);
      setSelectedTransactionId(transactionId);
      
      // Set the data needed for the modal
      setSelectedTransaction({
        id: data.id,
        currentStatus: data.currentStatus,
        events: data.events || []
      });
      
      // Show the modal
      setShowTimelineModal(true);
      
    } catch (error) {
      console.error('Error fetching timeline:', error);
      setTimelineError(error.message || 'Failed to load timeline');
    } finally {
      setTimelineLoading(false);
    }
  };
  
  // Get status indicator classes based on status
  const getStatusIndicator = (status) => {
    return `${statusColors[status] || 'bg-gray-400'} h-3 w-3 rounded-full`;
  };
  
  const filteredTransactions = processedTransactions();

  return (
    <div className="flex h-screen bg-colour2">
      <div className="flex w-full flex-1 flex-col overflow-hidden border border-neutral-200 bg-colour2 md:flex-row">
        {/* Sidebar component */}
        <FoodDistributionSidebar />
        
        {/* Main content area */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col py-8 px-4 bg-gradient-to-b from-colour2 to-white">
            <div className="max-w-6xl mx-auto w-full">
              <h1 className="font-Birthstone text-4xl md:text-5xl font-bold text-colour1 mb-2 text-center">
                Food Donation Transactions
              </h1>
              <p className="font-merriweather text-colour4 mb-8 text-center">
                View and manage all food donation transactions
              </p>
              
              {/* Filters and search */}
              <div className="bg-white shadow-md rounded-xl p-4 border border-colour3 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by ID, food type, donor..."
                      className="block w-full pl-10 pr-3 py-2 border border-colour3 rounded-md focus:ring-colour1 focus:border-colour1"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {/* Status filter */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-3 py-2 border border-colour3 rounded-md focus:ring-colour1 focus:border-colour1"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Order Placed</option>
                      <option value="requested">Processing</option>
                      <option value="picked_up">Order Picked Up</option>
                      <option value="in_transit">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="confirmed">Verified & Completed</option>
                    </select>
                  </div>
                  
                  {/* Sort options */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ArrowDownUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="block w-full pl-10 pr-3 py-2 border border-colour3 rounded-md focus:ring-colour1 focus:border-colour1"
                      value={`${sortField}-${sortDirection}`}
                      onChange={(e) => {
                        const [field, direction] = e.target.value.split('-');
                        setSortField(field);
                        setSortDirection(direction);
                      }}
                    >
                      <option value="date-desc">Date (Newest first)</option>
                      <option value="date-asc">Date (Oldest first)</option>
                      <option value="id-asc">ID (Ascending)</option>
                      <option value="id-desc">ID (Descending)</option>
                      <option value="status-asc">Status (Pending to Completed)</option>
                      <option value="status-desc">Status (Completed to Pending)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Transactions list */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-colour3">
                  <thead className="bg-colour2 bg-opacity-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor/Recipient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 font-merriweather">
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="hover:bg-amber-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-colour4">#{transaction._id}</div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {transaction.foodListing?.predictedCategory || "Mixed Meals"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.foodListing?.weight
                              ? `${transaction.foodListing.weight} kg`
                              : "8 servings"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {transaction.donor?.name || "Generous Kitchen"}
                            </div>
                            <div className="text-sm text-gray-500">
                              To: {transaction.ngo?.name || transaction.volunteer?.name || "Recipient"}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {formatDate(transaction.updatedAt || transaction.createdAt || new Date())}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={getStatusIndicator(transaction.status)}></span>
                            <span className="text-sm font-medium">
                              {statusLabels[transaction.status] || "Unknown"}
                            </span>
                            {transaction.status === "confirmed" && (
                              <Award className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            className="px-4 py-1 bg-colour1 text-white text-sm rounded-md hover:bg-amber-600 transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleViewTransaction(transaction._id);
                            }}
                          >
                            View Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Loading and error states */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-colour1"></div>
                  <p className="mt-2 text-colour4">Loading transactions...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              )}
              
              {!isLoading && !error && filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-lg text-colour4">No transactions found</p>
                </div>
              )}
              
              {/* Role-specific action button */}
              {userRole === 'donor' && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate('/create-donation')}
                    className="px-6 py-3 bg-colour4 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition-colors"
                  >
                    Create New Donation
                  </button>
                </div>
              )}
              
              {/* Inspirational quote */}
              <div className="mt-10 mb-6 text-center">
                <p className="font-rouge text-2xl italic text-colour4">
                  "Every transaction is a story of generosity and hope"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTransaction && (
        <TimelineModal
          isOpen={showTimelineModal}
          onClose={() => setShowTimelineModal(false)}
          transactionId={selectedTransaction.id}
          initialStatus={selectedTransaction.currentStatus}
          initialEvents={selectedTransaction.events}
        />
      )}
      {timelineLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-colour1"></div>
          <p className="mt-2 text-colour4">Loading timeline...</p>
        </div>
      )}
      {timelineError && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
          <p className="text-red-500">Error: {timelineError}</p>
        </div>
      )}
      
  
    </div>
  );
};

export default TransactionsList;