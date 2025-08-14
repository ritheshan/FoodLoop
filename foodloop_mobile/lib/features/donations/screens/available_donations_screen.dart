import 'package:flutter/material.dart';
import 'package:foodloop_mobile/core/theme/app_pallete.dart';
import 'package:foodloop_mobile/core/utils/app_loader.dart';
import 'package:foodloop_mobile/features/donations/services/donation_service.dart';
import 'package:foodloop_mobile/features/donations/widgets/donation_card.dart';

class AvailableDonationsScreen extends StatefulWidget {
  const AvailableDonationsScreen({super.key});

  @override
  State<AvailableDonationsScreen> createState() => _AvailableDonationsScreenState();
}

class _AvailableDonationsScreenState extends State<AvailableDonationsScreen> {
  final DonationService _donationService = DonationService();
  late Future<List<dynamic>> _donationsFuture;
  
  @override
  void initState() {
    super.initState();
    _loadDonations();
  }
  
  void _loadDonations() {
    _donationsFuture = _donationService.getAvailableDonations();// Debug output

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppPallete.gradient1,
        title: const Text('Available Donations'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _loadDonations();
                
              });
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          setState(() {
            _loadDonations();
          });
        },
        child: FutureBuilder<List<dynamic>>(
          future: _donationsFuture,
          builder: (context, snapshot) {
            print('Snapshot data: ${snapshot.data}'); // Debug output
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
                      'Error loading donations',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      snapshot.error.toString(),
                      style: Theme.of(context).textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        setState(() {
                          _loadDonations();
                        });
                      },
                      child: const Text('Try Again'),
                    ),
                  ],
                ),
              );
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.no_food, size: 60, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text(
                      'No donations available',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Check back later for new donations',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              );
            } else {
              // Display the list of available donations
              return ListView.builder(
  padding: const EdgeInsets.only(top: 8, bottom: 16),
  itemCount: snapshot.data!.length,
  itemBuilder: (context, index) {
    final donation = snapshot.data![index];
    
    // Log the donation format to help debug
    print('Donation ${index}: ${donation['_id']}, location: ${donation['location']}');
    
    return DonationCard(
      donation: donation,
      onTap: () {
        Navigator.pushNamed(
          context, 
          '/donation-details',
          arguments: donation,
        );
      },
    );
  },
);
            }
          },
        ),
      ),
    );
  }
}