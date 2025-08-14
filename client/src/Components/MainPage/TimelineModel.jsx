import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  ChevronRight,
  Award,
  X,
  Truck,
  Package,
  ShoppingBag,
  Loader,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Status mapping to user-friendly labels
const statusLabels = {
  'pending': 'Order Placed',
  'requested': 'Processing',
  'picked_up': 'Order Picked Up',
  'in_transit': 'Out for Delivery',
  'delivered': 'Delivered',
  'confirmed': 'Verified & Completed'
  // Note: 'on_chain' isn't in the timeline statuses per schema, it's a transaction status
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

// Status icons
const statusIcons = {
  'pending': Clock,
  'requested': Package,
  'picked_up': ShoppingBag,
  'in_transit': Truck,
  'delivered': CheckCircle,
  'confirmed': Award
};

// Define the sequence of statuses (without on_chain as it's not a timeline status)
const statusSequence = [
  'pending',
  'requested',
  'picked_up',
  'in_transit',
  'delivered',
  'confirmed'
];

const TimelineModal = ({ 
  isOpen, 
  onClose, 
  transactionId, 
  initialStatus, 
  initialEvents = [] 
}) => {
  const { token, hasRole, user } = useAuth();
  const [events, setEvents] = useState(initialEvents);
  const [currentStatus, setCurrentStatus] = useState(initialStatus || 'pending');
  const [transactionStatus, setTransactionStatus] = useState(initialStatus || 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId || !isOpen) return;
  
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/api/transaction/orders/${transactionId}/timeline`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!res.ok) {
          throw new Error("Failed to fetch timeline data.");
        }
  
        const data = await res.json();
        console.log("Timeline data:", data);
        
        // Store the actual transaction status
        setTransactionStatus(data.currentStatus || '');
        
        // For the timeline display, if status is 'on_chain', show as 'confirmed'
        // 'on_chain' is a transaction status, but the timeline only goes up to 'confirmed'
        if (data.currentStatus === 'on_chain') {
          // For visual display, show as confirmed (the last step in the process)
          setCurrentStatus('confirmed');
        } else {
          setCurrentStatus(data.currentStatus || '');
        }
        
        // Sort events by timestamp (oldest first for timeline display)
        setEvents(
          [...(data.events || [])].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          )
        );
  
      } catch (err) {
        console.error("❌ Failed to fetch updated timeline:", err);
      }
    };
  
    fetchTransaction();
  }, [isOpen, transactionId, token]);

  // Get user role
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

  // Check if user can update to next status based on their role and transaction status
  const canUpdateStatus = () => {
    // If transaction is already on blockchain, no further updates allowed
    if (transactionStatus === 'on_chain') {
      return false;
    }
    
    // Admin can update any status
    if (hasRole('admin')) return true;

    // Add other role-based permissions as needed
    // This is your simplified version that returns true for all roles
    return true;
  };

  // Get the next status in the sequence
  const getNextStatus = (status) => {
    // If transaction is already on blockchain, there's no next status
    if (transactionStatus === 'on_chain') {
      return null;
    }
    
    const currentIndex = statusSequence.indexOf(status);
    if (currentIndex < statusSequence.length - 1) {
      return statusSequence[currentIndex + 1];
    }
    return null; // Already at the last status
  };

  // Update status
  const updateStatus = async (nextStatus) => {
    if (!nextStatus || !transactionId) return;

    setIsLoading(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/transaction/orders/${transactionId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: nextStatus,
            by: userRole,
            note: `Status updated to ${statusLabels[nextStatus]} by ${userRole}`
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Status updated:', data);
      
      // Update local state
      setTransactionStatus(data.transaction.status);
      
      // For timeline display, if transaction is on_chain, show as confirmed
      if (data.transaction.status === 'on_chain') {
        setCurrentStatus('confirmed');
      } else {
        setCurrentStatus(data.transaction.status);
      }
      
      setEvents(data.transaction.timeline || []);
      setUpdateSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next status click
  const handleNextStatus = () => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      updateStatus(nextStatus);
    }
  };

  // If not open, don't render
  if (!isOpen) return null;

  // Get next status
  const nextStatus = getNextStatus(currentStatus);
  
  // Check if current user can update to next status
  const userCanUpdate = nextStatus && canUpdateStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
        <div className="bg-colour1 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-merriweather text-xl font-semibold">Delivery Timeline</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Current Status */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-colour2 rounded-full mb-2">
              {transactionStatus === 'on_chain' ? (
                <Award className="h-8 w-8 text-colour1" />
              ) : (
                React.createElement(statusIcons[currentStatus] || Clock, { 
                  className: "h-8 w-8 text-colour1" 
                })
              )}
            </div>
            <h4 className="text-xl font-bold text-colour4">
              {transactionStatus === 'on_chain' ? 'On Blockchain (Verified & Completed)' : statusLabels[currentStatus]}
            </h4>
            <p className="text-gray-500 mt-1">Transaction ID: {transactionId}</p>
            
            {/* Show blockchain status if on_chain */}
            {transactionStatus === 'on_chain' && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" /> Blockchain Verified
                </span>
              </div>
            )}
          </div>
          
          {/* Status Timeline */}
          <div className="relative pb-12">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full">
              <div className="w-1 bg-gray-200 h-full"></div>
            </div>
            
            {statusSequence.map((status, index) => {
              // For transactions on blockchain, show all timeline steps as completed
              const isPast = 
                transactionStatus === 'on_chain' ? true : 
                statusSequence.indexOf(currentStatus) >= index;
              
              const isCurrent = 
                transactionStatus === 'on_chain' ? 
                (status === 'confirmed') : 
                (currentStatus === status);
              
              // Find the matching event from timeline data
              const matchingEvent = events.find(e => e.status === status);
              
              return (
                <div key={status} className="relative mb-8 flex items-center">
                  <div className="flex items-center justify-center w-full">
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      {isPast ? (
                        <div className={`${statusColors[status]} h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white">
                          <Circle className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <h4 className={`font-medium ${isPast ? 'text-colour4' : 'text-gray-400'}`}>
                        {statusLabels[status]}
                      </h4>
                      
                      {/* Show timestamp if event exists */}
                      {matchingEvent && (
                        <p className="text-sm text-gray-500">
                          {formatDate(matchingEvent.timestamp)}
                          {matchingEvent.by && ` • By ${matchingEvent.by}`}
                        </p>
                      )}
                      
                      {/* Show note if exists */}
                      {matchingEvent?.note && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          "{matchingEvent.note}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Update Status Button - Only show if there's a next status and user can update */}
          {nextStatus && userCanUpdate && transactionStatus !== 'on_chain' && (
            <div className="mt-6 text-center">
              <button
                onClick={handleNextStatus}
                disabled={isLoading || transactionStatus === 'on_chain'}
                className="px-6 py-3 bg-colour1 text-white font-medium rounded-md shadow-md hover:bg-amber-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="h-5 w-5 mr-2" />
                )}
                Move to {statusLabels[nextStatus]}
              </button>
              
              {updateSuccess && (
                <p className="text-green-600 mt-2">Status updated successfully!</p>
              )}
              
              {error && (
                <div className="flex items-center justify-center text-red-500 mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Certificate Info - Only show if status is confirmed or on_chain but mint button only if not on_chain yet */}
          {(currentStatus === 'confirmed' || transactionStatus === 'on_chain') && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <Award className="h-10 w-10 text-green-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-green-700">Certificate {transactionStatus === 'on_chain' ? 'Minted' : 'Ready'}</h4>
              <p className="text-green-600">
                This donation has been verified and {transactionStatus === 'on_chain' ? 'has been' : 'is ready to be'} minted on the blockchain.
              </p>
              
              {/* Only show mint button if transaction is not already on blockchain */}
              {transactionStatus !== 'on_chain' && currentStatus === 'confirmed' && (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/transaction/confirm-delivery/${transactionId}`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      
                      if (!response.ok) {
                        throw new Error("Failed to mint certificate");
                      }
                      
                      const data = await response.json();
                      console.log("Mint result:", data);
                      alert(data.message);
                      
                      // Refresh the timeline data to show the new on_chain status
                      if (data.success) {
                        setTransactionStatus('on_chain');
                        // Visual status remains at 'confirmed'
                      }
                    } catch (error) {
                      console.error("Error minting certificate:", error);
                      alert("Failed to mint certificate: " + error.message);
                    }
                  }}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Mint Certificate NFT
                </button>
              )}
              
              {/* Show success indicator if already on blockchain */}
              {transactionStatus === 'on_chain' && (
                <div className="mt-3 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-green-700 font-medium">Certificate successfully minted on blockchain</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TimelineModal;