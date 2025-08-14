import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';

class DonationCard extends StatefulWidget {
  final Map<String, dynamic> donation;
  final VoidCallback? onTap;

  const DonationCard({super.key, required this.donation, this.onTap});

  @override
  State<DonationCard> createState() => _DonationCardState();
}

class _DonationCardState extends State<DonationCard> {
  final AuthService _authService = AuthService();
  String? userRole;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _getUserRole();
  }

  Future<void> _getUserRole() async {
    try {
      final userProfile = await _authService.getUserProfile();
      print('User Profile: $userProfile'); // Debug output
      setState(() {
        userRole = userProfile['user']['role'];
        isLoading = false;
        print('User Role: $userRole'); // Debug output
      });
    } catch (e) {
      setState(() {
        userRole = null;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    String _getString(dynamic value, [String fallback = '']) {
      if (value is String) return value;
      if (value is Map) return value.toString();
      return value?.toString() ?? fallback;
    }

    final String title = _getString(
      widget.donation['foodType'],
      'Unknown Food',
    );
    final String description = _getString(
      widget.donation['name'],
      'No description available',
    );
    final String category = _getString(
      widget.donation['predictedCategory'],
      'Uncategorized',
    );
    final String quantity = _getString(
      widget.donation['listingCount'],
      'Unknown',
    );
    final String location = _getString(
      widget.donation['location'],
      'Location not specified',
    );

    // Get coordinates
    List<double>? coordinates;
    if (widget.donation['location'] != null) {
      // Check if location is a string with Lat/Lng format
      if (widget.donation['location'] is String &&
          widget.donation['location'].toString().contains('Lat:') &&
          widget.donation['location'].toString().contains('Lng:')) {
        try {
          final locationStr = widget.donation['location'].toString();
          final latStr = RegExp(
            r'Lat: ([\d\.]+)',
          ).firstMatch(locationStr)?.group(1);
          final lngStr = RegExp(
            r'Lng: ([\d\.]+)',
          ).firstMatch(locationStr)?.group(1);

          if (latStr != null && lngStr != null) {
            coordinates = [
              double.parse(lngStr),
              double.parse(latStr),
            ]; // [lng, lat]
          }
        } catch (e) {
          print('Error parsing location string: $e');
        }
      }
      // Check if location is a Map with coordinates
      else if (widget.donation['location'] is Map &&
          widget.donation['location']['coordinates'] != null) {
        final coords = widget.donation['location']['coordinates'];
        if (coords is List && coords.length == 2) {
          try {
            coordinates = [
              double.parse(coords[0].toString()),
              double.parse(coords[1].toString()),
            ];
          } catch (e) {
            print('Error parsing coordinates from map: $e');
          }
        }
      }
      // Check if location has direct latitude/longitude fields
      else if (widget.donation.containsKey('lat') &&
          widget.donation.containsKey('lng')) {
        try {
          coordinates = [
            double.parse(widget.donation['lng'].toString()),
            double.parse(widget.donation['lat'].toString()),
          ];
        } catch (e) {
          print('Error parsing direct lat/lng: $e');
        }
      }
    }

    // Add logging to help debug
    if (coordinates != null) {
      print(
        'DonationCard extracted coordinates: $coordinates for donation: ${widget.donation['_id']}',
      );
    } else {
      print(
        'Failed to extract coordinates for donation: ${widget.donation['_id']}, location data: ${widget.donation['location']}',
      );
    }

    // Get the image URL(s) from the donation
    String imageUrl = '';
    if (widget.donation['images'] != null) {
      if (widget.donation['images'] is List &&
          (widget.donation['images'] as List).isNotEmpty) {
        // Safely get the first image
        final firstImage = (widget.donation['images'] as List).first;
        imageUrl = _getString(firstImage);
      } else if (widget.donation['images'] is String) {
        imageUrl = widget.donation['images'] as String;
      }
    }
    final String status = _getString(widget.donation['status'], 'Anonymous');
    final String donationId = _getString(widget.donation['_id'], '');

    // Format the date safely
    String formattedDate = '';
    try {
      if (widget.donation['expiryDate'] != null) {
        final date = DateTime.parse(widget.donation['expiryDate']);
        formattedDate = DateFormat('MMM d, yyyy').format(date);
      }
    } catch (_) {
      formattedDate = 'Invalid date';
    }

    bool canClaim =
        !isLoading && (userRole == 'NGO' || userRole == 'volunteer');

    return Card(
      elevation: 3,
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Original card content
          InkWell(
            onTap: widget.onTap,
            borderRadius: BorderRadius.circular(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Image
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  child:
                      imageUrl.isNotEmpty
                          ? Image.network(
                            imageUrl,
                            height: 150,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder:
                                (context, error, stackTrace) => Container(
                                  height: 150,
                                  color: Colors.grey[300],
                                  child: const Center(
                                    child: Icon(Icons.broken_image, size: 50),
                                  ),
                                ),
                          )
                          : Container(
                            height: 150,
                            color: Colors.grey[300],
                            child: const Center(
                              child: Icon(Icons.restaurant, size: 50),
                            ),
                          ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title & Category
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              category,
                              style: TextStyle(
                                color: Colors.green[800],
                                fontSize: 12,
                              ),
                            ),
                          ),
                          SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              status,
                              style: TextStyle(
                                color: Colors.green[800],
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 8),

                      // Description
                      Text(
                        description,
                        style: const TextStyle(fontSize: 14),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),

                      const SizedBox(height: 12),

                      // Location
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 16,
                            color: Colors.grey[600],
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              location,
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 14,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 4),

                      // Quantity & Date
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.restaurant,
                                size: 16,
                                color: Colors.grey[600],
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Qty: $quantity',
                                style: TextStyle(
                                  color: Colors.grey[600],
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            formattedDate,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
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

          // Add claim button for NGO users
          if (canClaim)
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(
                          context,
                          '/donation-map',
                          arguments: {
                            'donationId': donationId,
                            'title': title,
                            'location': location,
                            'coordinates': coordinates,
                          },
                        );
                      },
                      child: const Text('Claim Donation'),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
