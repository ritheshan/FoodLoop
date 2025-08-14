// sections/AuditLogs.jsx
import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../../api/admin';
import AuditLogFilters from '../../../Components/AdminControl/AuditLogFilters';
import AuditTable from '../../../Components/AdminControl/AuditTable';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: 'all',
    action: 'all',
    dateRange: 'all',
    userId: ''
  });
  
  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs(filters);
      console.log("Fetched logs:", data); // Keep for debugging
      setLogs(data);
    } catch (error) {
      console.error("Error loading audit logs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadLogs();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadLogs, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [filters]); // This dependency array means loadLogs will run when filters change
  
  const getSuspiciousCount = () => {
    return logs.filter(log => log.severity === 'warning' || log.severity === 'critical').length;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">System Audit Logs</h2>
        
        {getSuspiciousCount() > 0 && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
            <span className="font-bold">{getSuspiciousCount()}</span> suspicious activities detected
          </div>
        )}
      </div>
      
      <AuditLogFilters filters={filters} setFilters={setFilters} />
      
      <AuditTable logs={logs} loading={loading} />
    </div>
  );
};

export default AuditLogs;