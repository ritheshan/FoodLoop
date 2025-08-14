import 'dart:async';
import 'package:flutter/material.dart';
import 'package:foodloop_mobile/features/donations/services/donation_service.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
// import '../services/donation_service.dart';
import 'package:geolocator/geolocator.dart';

class FoodMapScreen extends StatefulWidget {
  const FoodMapScreen({super.key});

  @override
  _FoodMapScreenState createState() => _FoodMapScreenState();
}

class _FoodMapScreenState extends State<FoodMapScreen> {
  final DonationService _donationService = DonationService();
  final Completer<GoogleMapController> _controller = Completer();
  final Map<MarkerId, Marker> _markers = {};
  bool _isLoading = true;
  // Position tracking
  StreamSubscription<Position>? _positionStreamSubscription;
  Position? _lastKnownPosition;

  // Set up position stream to continuously track user location
  void _startPositionStream() {
    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 10, // Only notify if user moves at least 10 meters
    );
    
    _positionStreamSubscription = Geolocator.getPositionStream(
      locationSettings: locationSettings
    ).listen((Position position) {
      setState(() {
        _lastKnownPosition = position;
        
        // Update user position marker
        final userMarkerId = MarkerId('user_location');
        final userMarker = Marker(
          markerId: userMarkerId,
          position: LatLng(position.latitude, position.longitude),
          icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
          infoWindow: InfoWindow(title: 'Your Location')
        );
        
        _markers[userMarkerId] = userMarker;
      });
    });
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    super.dispose();
  }
  // Default center position (can be updated with user's location)
  
  CameraPosition _initialPosition = CameraPosition(
    target: LatLng(37.42796133580664, -122.085749655962), // Default position until we get user location
    zoom: 14.0,
  );
  
  // This will store the user's actual location once retrieved
  Position? _currentPosition;
  
  @override
  void initState() {
    super.initState();
    _loadMapData();
  }
  
  Future<void> _loadMapData() async {
    setState(() => _isLoading = true);
    
    try {
      // Try to get user location first
      await _getCurrentLocation();
      
      // Load available donations
      final donations = await _donationService.getAvailableDonations();
      _addDonationMarkers(donations);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading map data: $e'))
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  Future<void> _getCurrentLocation() async {
    try {
      // Check if location permission is granted
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      
      if (permission == LocationPermission.denied || 
          permission == LocationPermission.deniedForever) {
        return;
      }
      
      // Get current location
      Position position = await Geolocator.getCurrentPosition();
      
      // Update camera position
      _initialPosition = CameraPosition(
        target: LatLng(position.latitude, position.longitude),
        zoom: 14.0,
      );
      
      // If map is already created, move camera
      if (_controller.isCompleted) {
        final GoogleMapController controller = await _controller.future;
        controller.animateCamera(CameraUpdate.newCameraPosition(_initialPosition));
      }
    } catch (e) {
      print('Error getting current location: $e');
    }
  }
  
  void _addDonationMarkers(List<dynamic> donations) {
    for (int i = 0; i < donations.length; i++) {
      final donation = donations[i];
      if (donation['location'] != null && 
          donation['location']['coordinates'] != null) {
        
        final coordinates = donation['location']['coordinates'];
        // MongoDB stores coordinates as [lng, lat]
        final lng = coordinates[0];
        final lat = coordinates[1];
        
        final markerId = MarkerId('donation_$i');
        final marker = Marker(
          markerId: markerId,
          position: LatLng(lat, lng),
          infoWindow: InfoWindow(
            title: donation['foodDescription'] ?? 'Food Donation',
            snippet: 'Expires: ${donation['expirationDate'] != null ? 
              donation['expirationDate'].toString().substring(0, 10) : 'Unknown'}',
          ),
          onTap: () => _showDonationDetails(donation),
        );
        
        setState(() {
          _markers[markerId] = marker;
        });
      }
    }
  }
  
  void _showDonationDetails(Map<String, dynamic> donation) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              donation['foodDescription'] ?? 'Food Donation',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            ListTile(
              leading: Icon(Icons.access_time, color: Colors.orange),
              title: Text('Age: ${donation['hoursOld'] ?? 0} hours old'),
            ),
            ListTile(
              leading: Icon(Icons.ac_unit, color: Colors.orange),
              title: Text('Storage: ${donation['storage'] ?? 'Unknown'}'),
            ),
            ListTile(
              leading: Icon(Icons.scale, color: Colors.orange),
              title: Text('Weight: ${donation['weight'] ?? 'Unknown'} kg'),
            ),
            ListTile(
              leading: Icon(Icons.calendar_today, color: Colors.orange),
              title: Text('Expires: ${donation['expirationDate'] != null ? 
                donation['expirationDate'].toString().substring(0, 10) : 'Unknown'}'),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton.icon(
                  icon: Icon(Icons.directions),
                  label: Text('Directions'),
                  onPressed: () {
                    // Add directions functionality
                    Navigator.pop(context);
                  },
                ),
                ElevatedButton.icon(
                  icon: Icon(Icons.add_shopping_cart),
                  label: Text('Claim'),
                  onPressed: () {
                    // Add claim functionality
                    Navigator.pop(context);
                  },
                ),
              ],
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
        title: Text('Food Map'),
        backgroundColor: Colors.orange,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadMapData,
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Colors.orange))
          : GoogleMap(
              mapType: MapType.normal,
              initialCameraPosition: _initialPosition,
              markers: Set<Marker>.of(_markers.values),
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
              onMapCreated: (GoogleMapController controller) {
                _controller.complete(controller);
              },
            ),
    );
  }
}