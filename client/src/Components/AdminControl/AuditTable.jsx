import React from 'react';
import { AlertCircle, Info, AlertTriangle, Calendar, User, File } from 'lucide-react';

const AuditTable = ({ logs, loading }) => {
  console.log("Audit logs:", logs);
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading audit logs...</p>
      </div>
    );
  }
  
  if (!logs || logs.length === 0) {
    return (
      <div className="flex justify-center py-8 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No audit logs found matching the current filters</p>
      </div>
    );
  }
  
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={18} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getActionColor = (action) => {
    switch (action) {
      case 'delete':
        return 'text-red-600';
      case 'update':
        return 'text-amber-600';
      case 'create':
        return 'text-green-600';
      case 'login':
        return 'text-blue-600';
      case 'export':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getActionIcon = (action) => {
    switch (action) {
      case 'login':
        return <User size={16} className="mr-1" />;
      case 'export':
        return <File size={16} className="mr-1" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resource
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log.id} className={log.severity === 'critical' ? 'bg-red-50' : log.severity === 'warning' ? 'bg-yellow-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getSeverityIcon(log.severity)}
                  <span className="ml-2 text-sm capitalize font-medium">{log.severity}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(log.timestamp)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm">{log.user.name}</div>
                <div className="text-xs text-gray-500">{log.user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center text-sm font-medium ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                  <span className="capitalize">{log.action}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm">{log.resource}</span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {log.details}
                </div>
                {log.metadata && (
                  <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                    View Details
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <div>Showing {logs.length} entries</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 border border-gray-300 rounded bg-blue-50 text-blue-600">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AuditTable;