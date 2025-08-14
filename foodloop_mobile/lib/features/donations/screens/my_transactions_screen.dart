import 'package:flutter/material.dart';
import 'package:foodloop_mobile/core/utils/app_loader.dart';
import 'package:foodloop_mobile/features/donations/services/donation_service.dart';
import 'package:intl/intl.dart';

class MyTransactionsScreen extends StatefulWidget {
  const MyTransactionsScreen({super.key});

  @override
  State<MyTransactionsScreen> createState() => _MyTransactionsScreenState();
}

class _MyTransactionsScreenState extends State<MyTransactionsScreen> {
  final DonationService _donationService = DonationService();
  late Future<List<dynamic>> _transactionsFuture;
  
  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }
  
  void _loadTransactions() {
    _transactionsFuture = _donationService.getUserTransactions();
  }

  String _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFD700'; // Gold
      case 'requested':
        return '#1E90FF'; // DodgerBlue
      case 'picked_up':
        return '#87CEEB'; // SkyBlue
      case 'in_transit':
        return '#00BFFF'; // DeepSkyBlue
      case 'delivered':
        return '#32CD32'; // LimeGreen
      case 'confirmed':
        return '#008000'; // Green
      case 'rejected':
        return '#FF0000'; // Red
      default:
        return '#808080'; // Grey
    }
  }

  Widget _buildTransactionCard(Map<String, dynamic> transaction) {
    // Extract food listing details
    final foodListing = transaction['foodListing'] as Map<String, dynamic>?;
    final foodType = foodListing?['foodType'] ?? 'Unknown Food';
    final weight = foodListing?['weight'] ?? 'N/A';
    
    // Get status from the last timeline event
    final timeline = transaction['timeline'] as List<dynamic>?;
    String status = 'pending';
    String formattedDate = 'Unknown date';
    
    if (timeline != null && timeline.isNotEmpty) {
      final lastEvent = timeline.last;
      status = lastEvent['status'] ?? 'pending';
      
      try {
        final timestamp = DateTime.parse(lastEvent['timestamp']);
        formattedDate = DateFormat('MMM d, yyyy • h:mm a').format(timestamp);
      } catch (_) {
        formattedDate = 'Date unavailable';
      }
    }
    
    // Check for certificate data
    final certificateData = transaction['certificateData'] as Map<String, dynamic>?;
    final hasBlockchainCertificate = certificateData != null && 
                                   certificateData['transactionHash'] != null;
    
    // Get transaction ID
    final transactionId = transaction['_id'] as String? ?? 'Unknown ID';
    
    // Get NGO and volunteer information
    final ngo = transaction['ngo'] as Map<String, dynamic>?;
    final ngoName = ngo?['name'] ?? ngo?['organizationName'] ?? 'Unknown NGO';
    
    final volunteer = transaction['volunteer'] as Map<String, dynamic>?;
    final volunteerName = volunteer?['name'] ?? 'No volunteer assigned';
    final hasVolunteer = volunteer != null;
    
    final statusColor = _getStatusColor(status);
    
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Transaction ID and status
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '#${transactionId.substring(transactionId.length - 6)}',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Color(int.parse(statusColor.substring(1, 7), radix: 16) + 0xFF000000),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    status.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Food details
            Row(
              children: [
                const Icon(Icons.restaurant, size: 18, color: Colors.orange),
                const SizedBox(width: 8),
                Text(
                  foodType,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                Text(
                  '$weight kg',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 8),
            
            // NGO details
            Row(
              children: [
                const Icon(Icons.home_work, size: 18, color: Colors.blueGrey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'NGO: $ngoName',
                    style: const TextStyle(fontSize: 14),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            
            // Volunteer details if present
            if (hasVolunteer)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Row(
                  children: [
                    const Icon(Icons.directions_bike, size: 18, color: Colors.green),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Volunteer: $volunteerName',
                        style: const TextStyle(fontSize: 14),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            
            const SizedBox(height: 12),
            
            // Date and blockchain indicator
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formattedDate,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                if (hasBlockchainCertificate)
                  Row(
                    children: [
                      Icon(Icons.verified, size: 16, color: Colors.teal[400]),
                      const SizedBox(width: 4),
                      Text(
                        'Blockchain Verified',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.teal[400],
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
              ],
            ),
            
            // View details button
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    // Navigate to transaction details screen
                    Navigator.pushNamed(
                      context,
                      '/transaction-details',
                      arguments: transaction,
                    );
                  },
                  child: const Text('View Details'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: const Text('My Transactions'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _loadTransactions();
              });
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          setState(() {
            _loadTransactions();
          });
        },
        child: FutureBuilder<List<dynamic>>(
          future: _transactionsFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: FancyFoodLoader());
            } else if (snapshot.hasError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 60, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Failed to load transactions',
                      style: const TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Error: ${snapshot.error}',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _loadTransactions();
                        });
                      },
                      child: const Text('Try Again'),
                    ),
                  ],
                ),
              );
            } else if (snapshot.data!.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.receipt_long, size: 80, color: Colors.grey[400]),
                    const SizedBox(height: 16),
                    const Text(
                      'No transactions yet',
                      style: TextStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Your claimed donations will appear here',
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              );
            } else {
              // Display the list of transactions
              return ListView.builder(
                padding: const EdgeInsets.only(top: 8, bottom: 16),
                itemCount: snapshot.data!.length,
                itemBuilder: (context, index) {
                  final transaction = snapshot.data![index] as Map<String, dynamic>;
                  return _buildTransactionCard(transaction);
                },
              );
            }
          },
        ),
      ),
    );
  }
}