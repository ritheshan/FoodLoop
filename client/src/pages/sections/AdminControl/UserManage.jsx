// UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { fetchUsers, verifyUser, flagUser, deleteUser } from '../../../api/admin';
import UserFilters from '../../../Components/AdminControl/UserFilters';
import UserTable from '../../../Components/AdminControl/UserTable';
import UserDetailModal from '../../../Components/AdminControl/UserDetailModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: 'all', verificationStatus: 'all', searchTerm: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(filters);
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verified) => {
    try {
      await verifyUser(userId, verified);
      setUsers(users.map(user => 
        user._id === userId ? {...user, isVerified: verified} : user
      ));
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const handleFlagUser = async (userId, reason) => {
    try {
      await flagUser(userId, reason);
      // Update user status in the UI
      loadUsers();
    } catch (error) {
      console.error("Error flagging user:", error);
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <UserFilters filters={filters} setFilters={setFilters} />
      
      <UserTable 
        users={users} 
        loading={loading} 
        onVerify={handleVerifyUser}
        onFlag={handleFlagUser}
        onView={handleViewUserDetails}
      />
      
      {showModal && selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setShowModal(false)}
          onVerify={handleVerifyUser}
          onFlag={handleFlagUser}
        />
      )}
    </div>
  );
};

export default UserManagement;