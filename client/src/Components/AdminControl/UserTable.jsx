// components/UserTable.jsx
import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, Flag } from 'lucide-react';

const UserTable = ({ users, loading, onVerify, onFlag, onView }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }
  
  if (!users || users.length === 0) {
    return (
      <div className="flex justify-center py-8 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No users found matching the current filters</p>
      </div>
    );
  }
  
  const getRoleClass = (role) => {
    const roleClasses = {
      'donor': 'bg-blue-100 text-blue-800',
      'restaurant': 'bg-green-100 text-green-800',
      'ngo': 'bg-purple-100 text-purple-800',
      'admin': 'bg-red-100 text-red-800'
    };
    
    return roleClasses[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  const getVerificationIcon = (user) => {
    if (user.isVerified) {
      return <CheckCircle size={20} className="text-green-500" />;
    } else if (user.verificationRejected) {
      return <XCircle size={20} className="text-red-500" />;
    } else if (user.isFlagged) {
      return <AlertTriangle size={20} className="text-yellow-500" />;
    } else {
      return <span className="text-gray-400">—</span>;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className={user.isFlagged ? "bg-red-50" : ""}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.profileImage ? (
                      <img className="h-10 w-10 rounded-full" src={user.profileImage} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {user.name ? user.name.charAt(0) : (user.organizationName ? user.organizationName.charAt(0) : '?')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || user.organizationName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getVerificationIcon(user)}
                  <span className="ml-1 text-sm text-gray-500">
                    {user.isVerified ? 'Verified' : 
                     user.verificationRejected ? 'Rejected' : 
                     user.isFlagged ? 'Flagged' : 'Pending'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.location || '—'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(user)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Eye size={18} />
                  </button>
                  
                  {!user.isVerified && !user.verificationRejected && (
                    <button
                      onClick={() => onVerify(user._id, true)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  
                  {!user.isFlagged && (
                    <button
                      onClick={() => onFlag(user._id, "Manual flag by admin")}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <Flag size={18} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;