// api/mockData.js - Simulated data for admin dashboard development

// Mock user data
const users = [
    {
      id: 'usr_1001',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'donor',
      verificationStatus: 'verified',
      joinDate: '2024-10-12T14:22:10Z',
      donationsCount: 12,
      totalDonated: '$1,240',
      location: 'Chicago, IL',
      lastActive: '2025-04-18T09:12:45Z',
      profileComplete: true
    },
    {
      id: 'usr_1002',
      name: 'Michael Chen',
      email: 'mchen@foodhelp.org',
      role: 'volunteer',
      verificationStatus: 'pending',
      joinDate: '2025-01-27T08:10:22Z',
      volunteeredHours: 28,
      location: 'Seattle, WA',
      lastActive: '2025-04-19T15:33:12Z',
      profileComplete: false
    },
    {
      id: 'usr_1003',
      name: 'Community Foods Inc.',
      email: 'donations@communityfoods.com',
      role: 'business',
      verificationStatus: 'verified',
      joinDate: '2024-08-05T11:45:30Z',
      donationsCount: 32,
      totalDonated: '$8,750',
      location: 'Boston, MA',
      lastActive: '2025-04-17T11:20:05Z',
      profileComplete: true
    },
    {
      id: 'usr_1004',
      name: 'Food Distribution Center',
      email: 'contact@fooddist.org',
      role: 'distributor',
      verificationStatus: 'verified',
      joinDate: '2024-07-18T09:30:45Z',
      distributionsCount: 45,
      peopleHelped: 1240,
      location: 'Austin, TX',
      lastActive: '2025-04-19T08:45:30Z',
      profileComplete: true
    },
    {
      id: 'usr_1005',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'donor',
      verificationStatus: 'flagged',
      joinDate: '2025-02-01T16:20:00Z',
      donationsCount: 2,
      totalDonated: '$75',
      location: 'New York, NY',
      lastActive: '2025-04-10T14:22:35Z',
      flagReason: 'Suspicious donation patterns',
      profileComplete: true
    }
  ];
  
  // Mock donation data
  const donations = [
    {
      id: 'don_5001',
      donorId: 'usr_1001',
      donorName: 'Sarah Johnson',
      donorType: 'individual',
      items: [
        { name: 'Canned Vegetables', quantity: 24, expiryDate: '2025-12-15' },
        { name: 'Rice', quantity: 10, weight: '10kg' }
      ],
      status: 'delivered',
      createdAt: '2025-04-15T10:20:30Z',
      scheduledPickup: '2025-04-16T13:00:00Z',
      completedAt: '2025-04-16T13:12:45Z',
      value: 120,
      notes: 'Regular monthly donation'
    },
    {
      id: 'don_5002',
      donorId: 'usr_1003',
      donorName: 'Community Foods Inc.',
      donorType: 'business',
      items: [
        { name: 'Fresh Produce', quantity: 150, weight: '75kg', expiryDate: '2025-04-22' },
        { name: 'Bread', quantity: 50, expiryDate: '2025-04-21' },
        { name: 'Milk', quantity: 30, volume: '30L', expiryDate: '2025-04-25' }
      ],
      status: 'pending',
      createdAt: '2025-04-19T08:45:10Z',
      scheduledPickup: '2025-04-21T09:00:00Z',
      value: 450,
      notes: 'Weekend surplus'
    },
    {
      id: 'don_5003',
      donorId: 'usr_1005',
      donorName: 'John Smith',
      donorType: 'individual',
      items: [
        { name: 'Canned Soup', quantity: 5 }
      ],
      status: 'flagged',
      createdAt: '2025-04-18T14:10:20Z',
      scheduledPickup: '2025-04-20T11:00:00Z',
      value: 15,
      flagReason: 'Items past expiration date',
      notes: 'First time donor'
    },
    {
      id: 'don_5004',
      donorId: 'usr_1003',
      donorName: 'Community Foods Inc.',
      donorType: 'business',
      items: [
        { name: 'Pasta', quantity: 200, weight: '100kg' },
        { name: 'Canned Tomatoes', quantity: 150 },
        { name: 'Cooking Oil', quantity: 40, volume: '40L' }
      ],
      status: 'in_transit',
      createdAt: '2025-04-17T09:30:45Z',
      scheduledPickup: '2025-04-19T15:00:00Z',
      value: 520,
      notes: 'Monthly donation to local shelter'
    },
    {
      id: 'don_5005',
      donorId: 'usr_1001',
      donorName: 'Sarah Johnson',
      donorType: 'individual',
      items: [
        { name: 'Baby Food', quantity: 30 },
        { name: 'Diapers', quantity: 5, description: '5 packs of 24 diapers' }
      ],
      status: 'completed',
      createdAt: '2025-04-10T13:40:22Z',
      scheduledPickup: '2025-04-11T10:00:00Z',
      completedAt: '2025-04-11T10:15:30Z',
      value: 160,
      notes: 'Special donation for families with infants'
    }
  ];
  
  // Mock distributions data
  const distributions = [
    {
      id: 'dist_7001',
      distributorId: 'usr_1004',
      distributorName: 'Food Distribution Center',
      location: '123 Main St, Austin, TX',
      status: 'completed',
      date: '2025-04-15T10:00:00Z',
      endTime: '2025-04-15T14:00:00Z',
      peopleServed: 120,
      itemsDistributed: 450,
      donationsUsed: ['don_5001', 'don_5005'],
      volunteers: 8,
      notes: 'Weekly distribution event'
    },
    {
      id: 'dist_7002',
      distributorId: 'usr_1004',
      distributorName: 'Food Distribution Center',
      location: '456 Oak Ave, Austin, TX',
      status: 'planned',
      date: '2025-04-22T09:00:00Z',
      estimatedPeopleToServe: 150,
      donationsAllocated: ['don_5002', 'don_5004'],
      volunteersNeeded: 10,
      currentVolunteers: 6,
      notes: 'Monthly community outreach'
    },
    {
      id: 'dist_7003',
      distributorId: 'usr_1004',
      distributorName: 'Food Distribution Center',
      location: '789 Pine St, Austin, TX',
      status: 'in_progress',
      date: '2025-04-20T11:00:00Z',
      estimatedPeopleToServe: 80,
      currentCount: 45,
      donationsUsed: ['don_5004'],
      volunteers: 5,
      notes: 'Small distribution event'
    }
  ];
  
  // Mock audit logs
  const auditLogs = [
    {
      id: 'log_9001',
      timestamp: '2025-04-19T15:45:10Z',
      user: {
        id: 'usr_1004',
        name: 'Food Distribution Center', 
        email: 'contact@fooddist.org'
      },
      action: 'create',
      resource: 'distribution',
      resourceId: 'dist_7002',
      severity: 'info',
      details: 'Created new distribution event scheduled for April 22'
    },
    {
      id: 'log_9002',
      timestamp: '2025-04-19T14:22:30Z',
      user: {
        id: 'usr_1001',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com'
      },
      action: 'login',
      resource: 'account',
      resourceId: 'usr_1001',
      severity: 'info',
      details: 'User logged in from new device'
    },
    {
      id: 'log_9003',
      timestamp: '2025-04-19T12:10:05Z',
      user: {
        id: 'usr_9999',
        name: 'Admin User',
        email: 'admin@foodplatform.org'
      },
      action: 'flag',
      resource: 'user',
      resourceId: 'usr_1005',
      severity: 'warning',
      details: 'User flagged for suspicious donation patterns',
      metadata: {
        reason: 'Multiple expired items donated',
        actionTaken: 'Account temporarily restricted'
      }
    },
    {
      id: 'log_9004',
      timestamp: '2025-04-19T10:05:22Z',
      user: {
        id: 'usr_1003',
        name: 'Community Foods Inc.',
        email: 'donations@communityfoods.com'
      },
      action: 'create',
      resource: 'donation',
      resourceId: 'don_5002',
      severity: 'info',
      details: 'Created new donation with pickup scheduled for April 21'
    },
    {
      id: 'log_9005',
      timestamp: '2025-04-18T23:15:40Z',
      user: {
        id: 'sys_001',
        name: 'System',
        email: 'system@foodplatform.org'
      },
      action: 'delete',
      resource: 'distribution',
      resourceId: 'dist_7004',
      severity: 'critical',
      details: 'Distribution event deleted after being scheduled',
      metadata: {
        reason: 'Suspicious deletion outside of business hours',
        ip: '203.0.113.195',
        geolocation: 'Unknown location'
      }
    },
    {
      id: 'log_9006',
      timestamp: '2025-04-18T18:30:15Z',
      user: {
        id: 'usr_9999',
        name: 'Admin User',
        email: 'admin@foodplatform.org'
      },
      action: 'update',
      resource: 'user',
      resourceId: 'usr_1002',
      severity: 'info',
      details: 'Updated user verification status to pending'
    },
    {
      id: 'log_9007',
      timestamp: '2025-04-18T16:40:12Z',
      user: {
        id: 'usr_1005',
        name: 'John Smith',
        email: 'john.smith@example.com'
      },
      action: 'login',
      resource: 'account',
      resourceId: 'usr_1005',
      severity: 'warning',
      details: 'Failed login attempt (5th consecutive failure)',
      metadata: {
        ip: '203.0.113.42',
        location: "Different from user's registered location"
      }
    },
    {
      id: 'log_9008',
      timestamp: '2025-04-18T14:10:20Z',
      user: {
        id: 'usr_1005',
        name: 'John Smith',
        email: 'john.smith@example.com'
      },
      action: 'create',
      resource: 'donation',
      resourceId: 'don_5003',
      severity: 'warning',
      details: 'Donation automatically flagged for expired items'
    },
    {
      id: 'log_9009',
      timestamp: '2025-04-18T09:22:30Z',
      user: {
        id: 'usr_9999',
        name: 'Admin User',
        email: 'admin@foodplatform.org'
      },
      action: 'export',
      resource: 'users',
      resourceId: null,
      severity: 'info',
      details: 'Exported user data for reporting purposes'
    },
    {
      id: 'log_9010',
      timestamp: '2025-04-17T20:05:15Z',
      user: {
        id: 'sys_001',
        name: 'System',
        email: 'system@foodplatform.org'
      },
      action: 'update',
      resource: 'donation',
      resourceId: 'don_5004',
      severity: 'info',
      details: 'Automatically updated donation status to in_transit based on driver app'
    }
  ];
  
  // Mock overview stats data
  const overviewStats = {
    today: {
      activeUsers: 43,
      newDonations: 5,
      completedDeliveries: 3,
      peopleServed: 85,
      flaggedItems: 2,
      // Add these fields to match the StatCard component needs
      totalUsers: 245,
      userGrowth: 8,
      totalDonations: 78,
      donationGrowth: 12,
      totalFoodRescued: 1240.5,
      foodRescuedGrowth: 15,
      pendingVerifications: 28
    },
    week: {
      activeUsers: 128,
      newDonations: 22,
      completedDeliveries: 18,
      peopleServed: 320,
      flaggedItems: 4,
      // Add these fields
      totalUsers: 128,
      userGrowth: 4,
      totalDonations: 22,
      donationGrowth: 5,
      totalFoodRescued: 580.2,
      foodRescuedGrowth: 8,
      pendingVerifications: 15
    },
    month: {
      activeUsers: 245,
      newDonations: 78,
      completedDeliveries: 65,
      peopleServed: 1240,
      flaggedItems: 12,
      // Add these fields
      totalUsers: 245,
      userGrowth: 12,
      totalDonations: 78,
      donationGrowth: 15,
      totalFoodRescued: 1240.5,
      foodRescuedGrowth: 18,
      pendingVerifications: 28
    },
    year: {
      activeUsers: 1820,
      newDonations: 950,
      completedDeliveries: 892,
      peopleServed: 15400,
      flaggedItems: 58,
      // Add these fields
      totalUsers: 1820,
      userGrowth: 45,
      totalDonations: 950,
      donationGrowth: 28,
      totalFoodRescued: 18500.0,
      foodRescuedGrowth: 32,
      pendingVerifications: 35
    }
  };
  
  // Mock donation stats
  const donationStats = {
    today: {
      totalDonations: 5,
      totalValue: 1250,
      byType: {
        individual: 2,
        business: 3,
        organization: 0
      },
      topCategories: [
        { name: 'Fresh Produce', count: 2, value: 450 },
        { name: 'Canned Goods', count: 1, value: 320 },
        { name: 'Staples', count: 1, value: 280 },
        { name: 'Dairy', count: 1, value: 200 }
      ],
      hourlyActivity: [
        { hour: '8am', count: 1 },
        { hour: '10am', count: 2 },
        { hour: '12pm', count: 0 },
        { hour: '2pm', count: 1 },
        { hour: '4pm', count: 1 }
      ],
      // Add trends data for chart
      trends: [
        { date: '8am', donations: 1, value: 250 },
        { date: '10am', donations: 2, value: 500 },
        { date: '12pm', donations: 0, value: 0 },
        { date: '2pm', donations: 1, value: 300 },
        { date: '4pm', donations: 1, value: 200 }
      ],
      // Add top contributors data
      topContributors: [
        { id: 'usr_1003', name: 'Community Foods Inc.', type: 'business', donations: 2, total: 970 },
        { id: 'usr_1001', name: 'Sarah Johnson', type: 'individual', donations: 2, total: 280 },
        { id: 'usr_1005', name: 'John Smith', type: 'individual', donations: 1, total: 15 }
      ]
    },
    week: {
      totalDonations: 22,
      totalValue: 5840,
      byType: {
        individual: 8,
        business: 12,
        organization: 2
      },
      topCategories: [
        { name: 'Fresh Produce', count: 8, value: 1850 },
        { name: 'Canned Goods', count: 5, value: 1420 },
        { name: 'Staples', count: 4, value: 1200 },
        { name: 'Dairy', count: 3, value: 850 },
        { name: 'Meat', count: 2, value: 520 }
      ],
      dailyActivity: [
        { day: 'Mon', count: 4 },
        { day: 'Tue', count: 3 },
        { day: 'Wed', count: 5 },
        { day: 'Thu', count: 4 },
        { day: 'Fri', count: 3 },
        { day: 'Sat', count: 2 },
        { day: 'Sun', count: 1 }
      ],
      // Add trends data for chart
      trends: [
        { date: 'Mon', donations: 4, value: 1100 },
        { date: 'Tue', donations: 3, value: 820 },
        { date: 'Wed', donations: 5, value: 1350 },
        { date: 'Thu', donations: 4, value: 980 },
        { date: 'Fri', donations: 3, value: 790 },
        { date: 'Sat', donations: 2, value: 550 },
        { date: 'Sun', donations: 1, value: 250 }
      ],
      // Add top contributors data
      topContributors: [
        { id: 'usr_1003', name: 'Community Foods Inc.', type: 'business', donations: 8, total: 3500 },
        { id: 'usr_1001', name: 'Sarah Johnson', type: 'individual', donations: 5, total: 850 },
        { id: 'usr_1005', name: 'John Smith', type: 'individual', donations: 3, total: 320 },
        { id: 'usr_1006', name: 'Local Bakery', type: 'business', donations: 4, total: 780 },
        { id: 'usr_1008', name: 'Community Center', type: 'organization', donations: 2, total: 390 }
      ]
    },
    month: {
      totalDonations: 78,
      totalValue: 21450,
      byType: {
        individual: 30,
        business: 42,
        organization: 6
      },
      topCategories: [
        { name: 'Fresh Produce', count: 25, value: 6450 },
        { name: 'Canned Goods', count: 20, value: 5200 },
        { name: 'Staples', count: 15, value: 4500 },
        { name: 'Dairy', count: 10, value: 3200 },
        { name: 'Meat', count: 8, value: 2100 }
      ],
      weeklyActivity: [
        { week: 'Week 1', count: 20 },
        { week: 'Week 2', count: 22 },
        { week: 'Week 3', count: 18 },
        { week: 'Week 4', count: 18 }
      ],
      // Add trends data for chart
      trends: [
        { date: 'Week 1', donations: 20, value: 5200 },
        { date: 'Week 2', donations: 22, value: 6100 },
        { date: 'Week 3', donations: 18, value: 4800 },
        { date: 'Week 4', donations: 18, value: 5350 }
      ],
      // Add top contributors data
      topContributors: [
        { id: 'usr_1003', name: 'Community Foods Inc.', type: 'business', donations: 22, total: 8750 },
        { id: 'usr_1006', name: 'Local Bakery', type: 'business', donations: 18, total: 4200 },
        { id: 'usr_1001', name: 'Sarah Johnson', type: 'individual', donations: 12, total: 1240 },
        { id: 'usr_1010', name: 'City Food Bank', type: 'organization', donations: 6, total: 3800 },
        { id: 'usr_1009', name: 'Regional Grocers', type: 'business', donations: 10, total: 2850 }
      ]
    }
  };
  // Mock user stats
  const userStats = {
    today: {
      newUsers: 3,
      activeUsers: 43,
      byRole: {
        donor: 25,
        volunteer: 10,
        distributor: 5,
        business: 3
      },
      verificationStatus: {
        verified: 38,
        pending: 4,
        flagged: 1
      },
      hourlyLogins: [
        { hour: '8am', count: 5 },
        { hour: '10am', count: 8 },
        { hour: '12pm', count: 12 },
        { hour: '2pm', count: 9 },
        { hour: '4pm', count: 7 },
        { hour: '6pm', count: 2 }
      ],
      // Add growth data for chart
      growth: [
        { time: '8am', users: 1, active: 5 },
        { time: '10am', users: 0, active: 8 },
        { time: '12pm', users: 1, active: 12 },
        { time: '2pm', users: 0, active: 9 },
        { time: '4pm', users: 1, active: 7 },
        { time: '6pm', users: 0, active: 2 }
      ]
    },
    week: {
      newUsers: 12,
      activeUsers: 128,
      byRole: {
        donor: 70,
        volunteer: 35,
        distributor: 15,
        business: 8
      },
      verificationStatus: {
        verified: 110,
        pending: 15,
        flagged: 3
      },
      dailyLogins: [
        { day: 'Mon', count: 85 },
        { day: 'Tue', count: 78 },
        { day: 'Wed', count: 92 },
        { day: 'Thu', count: 88 },
        { day: 'Fri', count: 75 },
        { day: 'Sat', count: 45 },
        { day: 'Sun', count: 38 }
      ],
      // Add growth data for chart
      growth: [
        { time: 'Mon', users: 2, active: 85 },
        { time: 'Tue', users: 1, active: 78 },
        { time: 'Wed', users: 3, active: 92 },
        { time: 'Thu', users: 2, active: 88 },
        { time: 'Fri', users: 1, active: 75 },
        { time: 'Sat', users: 2, active: 45 },
        { time: 'Sun', users: 1, active: 38 }
      ]
    },
    month: {
      newUsers: 35,
      activeUsers: 245,
      byRole: {
        donor: 140,
        volunteer: 65,
        distributor: 25,
        business: 15
      },
      verificationStatus: {
        verified: 210,
        pending: 28,
        flagged: 7
      },
      weeklyLogins: [
        { week: 'Week 1', count: 180 },
        { week: 'Week 2', count: 195 },
        { week: 'Week 3', count: 210 },
        { week: 'Week 4', count: 185 }
      ],
      // Add growth data for chart
      growth: [
        { time: 'Week 1', users: 8, active: 180 },
        { time: 'Week 2', users: 9, active: 195 },
        { time: 'Week 3', users: 10, active: 210 },
        { time: 'Week 4', users: 8, active: 185 }
      ]
    }
  };
  
  // Export modified API functions that use mock data
 // api/admin.js
export const getAuditLogs = (filters) => {
    // Apply filters to mock data
    let filteredLogs = [...auditLogs];
    
    if (filters.severity !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
    }
    
    // Handle the more specific action types
    if (filters.action !== 'all') {
      if (filters.action === 'user-create') {
        filteredLogs = filteredLogs.filter(log => log.action === 'create' && log.resource === 'user');
      } else if (filters.action === 'user-update') {
        filteredLogs = filteredLogs.filter(log => log.action === 'update' && log.resource === 'user');
      } else if (filters.action === 'donation-create') {
        filteredLogs = filteredLogs.filter(log => log.action === 'create' && log.resource === 'donation');
      } else if (filters.action === 'donation-update') {
        filteredLogs = filteredLogs.filter(log => log.action === 'update' && log.resource === 'donation');
      } else if (filters.action === 'verification') {
        filteredLogs = filteredLogs.filter(log => 
          (log.action === 'update' && log.details.toLowerCase().includes('verification')) ||
          (log.action === 'create' && log.details.toLowerCase().includes('verification'))
        );
      } else {
        // For simple actions like 'login' or 'flag'
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
    }
    
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.user.id === filters.userId);
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          cutoffDate = new Date(now.setDate(now.getDate() - 1));
          cutoffDate.setHours(0, 0, 0, 0);
          const endOfYesterday = new Date(now.setDate(now.getDate()));
          endOfYesterday.setHours(0, 0, 0, 0);
          filteredLogs = filteredLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= cutoffDate && logDate < endOfYesterday;
          });
          return new Promise(resolve => {
            setTimeout(() => resolve(filteredLogs), 500);
          });
        case 'this-week':
          const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
          cutoffDate = new Date(now.setDate(now.getDate() - day));
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'this-month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          cutoffDate = new Date(0); // Beginning of time
      }
      
      // Don't filter again if we already did for 'yesterday'
      if (filters.dateRange !== 'yesterday') {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= cutoffDate);
      }
    }
    
    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    console.log("API returning filtered logs:", filteredLogs);
    
    // Simulate API delay
    return new Promise(resolve => {
      setTimeout(() => resolve(filteredLogs), 500);
    });
  };
  
  export const getOverviewStats = (timeframe) => {
    // Return the appropriate stats based on timeframe
    return new Promise(resolve => {
      setTimeout(() => resolve(overviewStats[timeframe] || overviewStats.today), 300);
    });
  };
  
  export const getDonationStats = (timeframe) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(donationStats[timeframe] || donationStats.today), 400);
    });
  };
  
  export const getUserStats = (timeframe) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(userStats[timeframe] || userStats.today), 350);
    });
  };
  
  export const fetchUsers = (filters) => {
    // Apply filters to mock data
    let filteredUsers = [...users];
    
    if (filters.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    if (filters.verificationStatus !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.verificationStatus === filters.verificationStatus);
    }
    
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search) ||
        (user.location && user.location.toLowerCase().includes(search))
      );
    }
    
    return new Promise(resolve => {
      setTimeout(() => resolve(filteredUsers), 600);
    });
  };
  
  export const fetchDonations = (filters) => {
    // Apply filters to mock data
    let filteredDonations = [...donations];
    
    if (filters.status !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.status === filters.status);
    }
    
    if (filters.donorType !== 'all') {
      filteredDonations = filteredDonations.filter(donation => donation.donorType === filters.donorType);
    }
    
    if (filters.flagged) {
      filteredDonations = filteredDonations.filter(donation => donation.status === 'flagged');
    }
    
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          cutoffDate = new Date(0);
      }
      
      filteredDonations = filteredDonations.filter(donation => 
        new Date(donation.createdAt) >= cutoffDate
      );
    }
    
    // Sort by creation date (newest first)
    filteredDonations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return new Promise(resolve => {
      setTimeout(() => resolve(filteredDonations), 550);
    });
  };
  
  // Add more mock implementation for other API functions as needed
  
  // For methods that modify data, just return success after a delay
  export const verifyUser = (userId, verified, notes = '') => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, userId, verified }), 300);
    });
  };
  
  export const flagUser = (userId, reason) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, userId, flagged: true }), 300);
    });
  };
  
  export const deleteUser = (userId) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, message: `User ${userId} deleted` }), 400);
    });
  };
  
  export const updateDonationStatus = (donationId, status) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, donationId, status }), 300);
    });
  };
  
  export const flagDonation = (donationId, reason) => {
    return new Promise(resolve => {
      setTimeout(() => resolve({ success: true, donationId, flagged: true }), 300);
    });
  };
  
  // Export the raw data for direct access if needed
  export const mockData = {
    users,
    donations,
    distributions,
    auditLogs,
    overviewStats,
    donationStats,
    userStats
  };