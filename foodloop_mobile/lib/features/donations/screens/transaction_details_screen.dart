import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:foodloop_mobile/core/constants/api_constants.dart';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class TransactionDetailsScreen extends StatelessWidget {
  final Map<String, dynamic> transaction;

  const TransactionDetailsScreen({super.key, required this.transaction});

  @override
  Widget build(BuildContext context) {
    // Extract transaction details
    final foodListing = transaction['foodListing'] as Map<String, dynamic>?;
    final foodType = foodListing?['foodType'] ?? 'Unknown Food';
    final weight = foodListing?['weight'] ?? 'N/A';
    final description =
        foodListing?['foodDescription'] ?? 'No description available';

    // Extract blockchain certificate data if available
    final certificateData =
        transaction['certificateData'] as Map<String, dynamic>?;
    final hasBlockchainCertificate =
        certificateData != null && certificateData['transactionHash'] != null;
    final transactionHash = certificateData?['transactionHash'] ?? '';

    // Get transaction ID
    final transactionId = transaction['_id'] as String? ?? 'Unknown ID';

    // Get parties involved
    final donor = transaction['donor'] as Map<String, dynamic>?;
    final donorName =
        donor?['name'] ?? donor?['organizationName'] ?? 'Unknown Donor';

    final ngo = transaction['ngo'] as Map<String, dynamic>?;
    final ngoName = ngo?['name'] ?? ngo?['organizationName'] ?? 'Unknown NGO';

    final volunteer = transaction['volunteer'] as Map<String, dynamic>?;
    final volunteerName = volunteer?['name'] ?? 'No volunteer assigned';
    final hasVolunteer = volunteer != null;

    // Timeline events
    final timeline = transaction['timeline'] as List<dynamic>? ?? [];

    // Latest status from the timeline
    String currentStatus = timeline.isNotEmpty ?
                          timeline.last['status'] ?? 'pending' :
                          'pending';
    // String currentStatus =
    //     'delivered'; // For testing purposes, set to 'delivered'

    // Create date
    String createdDate = 'Unknown date';
    try {
      if (transaction['createdAt'] != null) {
        final date = DateTime.parse(transaction['createdAt']);
        createdDate = DateFormat('MMMM d, yyyy • h:mm a').format(date);
      }
    } catch (_) {
      createdDate = 'Date unavailable';
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.orange,
        title: Text(
          'Transaction #${transactionId.substring(transactionId.length - 6)}',
        ),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status banner
            Container(
              width: double.infinity,
              color: _getStatusColor(currentStatus),
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    currentStatus.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _getStatusDescription(currentStatus),
                    style: const TextStyle(color: Colors.white, fontSize: 14),
                  ),
                ],
              ),
            ),

            // Food information
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Food Information',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  _buildInfoRow('Type', foodType),
                  _buildInfoRow('Weight', '$weight kg'),
                  _buildInfoRow('Description', description),
                ],
              ),
            ),

            const Divider(),

            // Involved parties
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Involved Parties',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),

                  _buildPartyRow('Donor', donorName, Icons.person),
                  _buildPartyRow('NGO', ngoName, Icons.home_work),
                  if (hasVolunteer)
                    _buildPartyRow(
                      'Volunteer',
                      volunteerName,
                      Icons.directions_bike,
                    ),
                ],
              ),
            ),

            const Divider(),

            // Blockchain certificate
            if (hasBlockchainCertificate)
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.verified, color: Colors.teal),
                        const SizedBox(width: 8),
                        const Text(
                          'Blockchain Certificate',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    _buildInfoRow(
                      'Token ID',
                      certificateData?['nftTokenId'] ?? 'N/A',
                    ),

                    // Transaction hash with copy button
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(
                            width: 100,
                            child: Text(
                              'Tx Hash:',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  transactionHash.length > 20
                                      ? '${transactionHash.substring(0, 10)}...${transactionHash.substring(transactionHash.length - 10)}'
                                      : transactionHash,
                                  style: const TextStyle(fontFamily: 'Courier'),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    InkWell(
                                      onTap:
                                          () => _copyToClipboard(
                                            context,
                                            transactionHash,
                                          ),
                                      child: const Padding(
                                        padding: EdgeInsets.all(4),
                                        child: Row(
                                          children: [
                                            Icon(Icons.copy, size: 14),
                                            SizedBox(width: 4),
                                            Text(
                                              'Copy',
                                              style: TextStyle(fontSize: 12),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    InkWell(
                                      onTap:
                                          () => _openEtherscan(transactionHash),
                                      child: const Padding(
                                        padding: EdgeInsets.all(4),
                                        child: Row(
                                          children: [
                                            Icon(Icons.open_in_new, size: 14),
                                            SizedBox(width: 4),
                                            Text(
                                              'View on Etherscan',
                                              style: TextStyle(fontSize: 12),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    _buildInfoRow(
                      'Created on',
                      certificateData?['date'] ?? createdDate,
                    ),
                  ],
                ),
              ),

            const Divider(),

            // Timeline
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Transaction Timeline',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),

                  _buildTimeline(timeline),
                  if (currentStatus.toLowerCase() == 'delivered')
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 12,
                      ),
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(vertical: 16,horizontal: 24),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onPressed:
                            () => _confirmDelivery(context, transactionId),
                        icon: const Icon(Icons.verified),
                        label: const Text('Confirm Delivery on Blockchain'),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildPartyRow(String role, String name, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.grey),
          const SizedBox(width: 8),
          SizedBox(
            width: 80,
            child: Text(
              '$role:',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              name,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeline(List<dynamic> timeline) {
    if (timeline.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text('No timeline events available'),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: timeline.length,
      itemBuilder: (context, index) {
        final event = timeline[index] as Map<String, dynamic>;
        final status = event['status'] ?? 'unknown';
        final by = event['by'] ?? 'system';
        final note = event['note'] as String?;

        // Format the timestamp
        String formattedTime = 'Unknown time';
        try {
          if (event['timestamp'] != null) {
            final timestamp = DateTime.parse(event['timestamp']);
            formattedTime = DateFormat(
              'MMM d, yyyy • h:mm a',
            ).format(timestamp);
          }
        } catch (_) {
          formattedTime = 'Time unavailable';
        }

        final isLastItem = index == timeline.length - 1;

        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Timeline indicator
            Column(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: _getStatusColor(status),
                    shape: BoxShape.circle,
                  ),
                ),
                if (!isLastItem)
                  Container(width: 2, height: 70, color: Colors.grey[300]),
              ],
            ),
            const SizedBox(width: 16),
            // Event details
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getStatusTitle(status),
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'By ${_formatRoleName(by)}',
                      style: TextStyle(color: Colors.grey[600], fontSize: 14),
                    ),
                    if (note != null && note.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          note,
                          style: const TextStyle(
                            fontStyle: FontStyle.italic,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    const SizedBox(height: 4),
                    Text(
                      formattedTime,
                      style: TextStyle(color: Colors.grey[500], fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.amber;
      case 'requested':
        return Colors.blue;
      case 'picked_up':
        return Colors.cyan;
      case 'in_transit':
        return Colors.blueAccent;
      case 'delivered':
        return Colors.lightGreen;
      case 'confirmed':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getStatusTitle(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Donation Pending';
      case 'requested':
        return 'Donation Requested';
      case 'picked_up':
        return 'Food Picked Up';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered to NGO';
      case 'confirmed':
        return 'Delivery Confirmed';
      case 'rejected':
        return 'Donation Rejected';
      default:
        return status
            .split('_')
            .map(
              (s) => s.isEmpty ? '' : '${s[0].toUpperCase()}${s.substring(1)}',
            )
            .join(' ');
    }
  }

  String _getStatusDescription(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Donation is awaiting confirmation';
      case 'requested':
        return 'NGO has requested this donation';
      case 'picked_up':
        return 'Food has been picked up';
      case 'in_transit':
        return 'Food is on the way to NGO';
      case 'delivered':
        return 'Food has been delivered to NGO';
      case 'confirmed':
        return 'Delivery has been confirmed';
      case 'rejected':
        return 'Donation has been rejected';
      default:
        return 'Status unknown';
    }
  }

  String _formatRoleName(String role) {
    switch (role.toLowerCase()) {
      case 'donor':
        return 'Donor';
      case 'ngo':
        return 'NGO';
      case 'volunteer':
        return 'Volunteer';
      case 'system':
        return 'System';
      case 'admin':
        return 'Admin';
      default:
        return role;
    }
  }

  void _copyToClipboard(BuildContext context, String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Copied to clipboard')));
  }

  void _openEtherscan(String hash) async {
    // Using Sepolia testnet as mentioned in the codebase
    final url = 'https://sepolia.etherscan.io/tx/$hash';

    if (await canLaunch(url)) {
      await launch(url);
    }
  }

  void _confirmDelivery(BuildContext context, String transactionId) async {
    final url = Uri.parse(
      '${ApiConstants.baseUrl}/donations/confirm-delivery/$transactionId',
    );

    try {
      final _authService =
          AuthService(); // Assuming you have an AuthService to get the token
      final token = await _authService.getAuthToken();
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed:
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('✅ Delivery confirmed and NFT minted!')),
        );
        // Optionally: refresh UI or pop screen
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('❌ Failed: ${response.body}')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }
}
