// sections/DonationTracking.jsx
import React, { useState, useEffect } from 'react';
import { fetchDonations, updateDonationStatus } from '../../../api/admin';
import DonationFilters from '../../../Components/AdminControl/DonationFilters';
import DonationTable from '../../../Components/AdminControl/DonationTable';
import DonationDetailModal from '../../../Components/AdminControl/DonationDetailModal';

const DonationTracking = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    status: 'all', 
    dateRange: 'all',
    donorType: 'all',
    flagged: false
  });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDonations();
  }, [filters]);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await fetchDonations(filters);
      setDonations(data);
    } catch (error) {
      console.error("Error loading donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (donationId, status) => {
    try {
      await updateDonationStatus(donationId, status);
      setDonations(donations.map(donation => 
        donation._id === donationId ? {...donation, status} : donation
      ));
    } catch (error) {
      console.error("Error updating donation status:", error);
    }
  };

  const handleViewDonationDetails = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Donation Tracking</h2>
      
      <DonationFilters filters={filters} setFilters={setFilters} />
      
      <DonationTable 
        donations={donations} 
        loading={loading}
        onStatusUpdate={handleUpdateStatus}
        onView={handleViewDonationDetails}
      />
      
      {showModal && selectedDonation && (
        <DonationDetailModal 
          donation={selectedDonation} 
          onClose={() => setShowModal(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default DonationTracking;