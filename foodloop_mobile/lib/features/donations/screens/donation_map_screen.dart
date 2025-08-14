import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:foodloop_mobile/features/donations/services/donation_service.dart';
import 'package:foodloop_mobile/core/utils/app_loader.dart';
import 'package:url_launcher/url_launcher.dart';

class DonationMapScreen extends StatefulWidget {
  final Map<String, dynamic> args;

  const DonationMapScreen({super.key, required this.args});

  @override
  State<DonationMapScreen> createState() => _DonationMapScreenState();
}

class _DonationMapScreenState extends State<DonationMapScreen> {
  final Completer<GoogleMapController> _controller = Completer();
  final DonationService _donationService = DonationService();

  bool _isLoading = true;
  bool _isProcessing = false;
  bool _showTraffic = false;
  MapType _mapType = MapType.normal;

  LatLng? _currentLocation;
  LatLng? _donationLocation;
  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};
  double _distance = 0;
  String _duration = '';
  BitmapDescriptor? _personIcon;
  BitmapDescriptor? _foodIcon;

  final String _apiKey =
      'AIzaSyAOzi0yFEvMUUV0QVQ6YSY6t7H2sHhd2Ms'; // Replace this securely

  @override
  void initState() {
    super.initState();
    _loadCustomIcons().then((_) => _setupMap());
  }

  Future<void> _loadCustomIcons() async {
    _personIcon = BitmapDescriptor.defaultMarkerWithHue(
      BitmapDescriptor.hueAzure,
    );
    // _foodIcon = await BitmapDescriptor.fromAssetImage(
    //   const ImageConfiguration(size: Size(5, 5)),
    //   'assets/delivery.png',
    // );
  }

  Future<void> _setupMap() async {
    setState(() => _isLoading = true);

    try {
      // Get user's current location
      final position = await _determinePosition();
      _currentLocation = LatLng(position.latitude, position.longitude);

      // Get donation location from arguments
      List<double>? coordinates = widget.args['coordinates'];

      if (coordinates != null && coordinates.length == 2) {
        // Using the correct order: [longitude, latitude] to LatLng(latitude, longitude)
        _donationLocation = LatLng(
          coordinates[1],
          coordinates[0],
        ); // Note the swap!
        print(
          'Using coordinates from args: $coordinates -> $_donationLocation',
        );
      } else {
        // Try to parse location from string if coordinates weren't provided
        final locationString = widget.args['location'] as String?;
        if (locationString != null) {
          _donationLocation = _parseLocation(locationString);
          print(
            'Parsed location from string: $locationString -> $_donationLocation',
          );
        }
      }

      if (_currentLocation != null && _donationLocation != null) {
        _calculateDistance();
        _addMarkers();
      } else {
        throw Exception('Could not determine donation location');
      }
    } catch (e) {
      print('Error setting up map: $e');
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading map: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  // Improve the location parsing method to handle more formats
  LatLng? _parseLocation(dynamic location) {
    try {
      // Case 1: String format "Lat: X, Lng: Y"
      if (location is String &&
          location.contains('Lat:') &&
          location.contains('Lng:')) {
        final lat = double.tryParse(
          RegExp(r'Lat: ([\d\.]+)').firstMatch(location)?.group(1) ?? '',
        );
        final lng = double.tryParse(
          RegExp(r'Lng: ([\d\.]+)').firstMatch(location)?.group(1) ?? '',
        );

        if (lat != null && lng != null) {
          return LatLng(lat, lng);
        }
      }
      // Case 2: List of coordinates [longitude, latitude]
      else if (location is List && location.length == 2) {
        final lat = double.tryParse(location[1].toString());
        final lng = double.tryParse(location[0].toString());

        if (lat != null && lng != null) {
          return LatLng(lat, lng);
        }
      }
      // Case 3: Map with coordinates
      else if (location is Map && location['coordinates'] is List) {
        final coords = location['coordinates'] as List;
        if (coords.length == 2) {
          // API stores as [longitude, latitude]
          final lng = double.tryParse(coords[0].toString());
          final lat = double.tryParse(coords[1].toString());

          if (lat != null && lng != null) {
            return LatLng(lat, lng);
          }
        }
      }
      // Case 4: Direct lat/lng properties
      else if (location is Map &&
          location.containsKey('lat') &&
          location.containsKey('lng')) {
        final lat = double.tryParse(location['lat'].toString());
        final lng = double.tryParse(location['lng'].toString());

        if (lat != null && lng != null) {
          return LatLng(lat, lng);
        }
      }
    } catch (e) {
      print('Error parsing location: $e, input was: $location');
    }

    return null;
  }

  Future<Position> _determinePosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error('Location permissions are permanently denied.');
    }

    return await Geolocator.getCurrentPosition();
  }

  void _addMarkers() {
    if (_currentLocation == null || _donationLocation == null) return;

    setState(() {
      _markers = {
        Marker(
          markerId: const MarkerId('current_location'),
          position: _currentLocation!,
          infoWindow: const InfoWindow(title: 'Your Location'),
          icon:
              _personIcon ??
              BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueBlue),
        ),
        Marker(
          markerId: const MarkerId('donation_location'),
          position: _donationLocation!,
          infoWindow: InfoWindow(title: widget.args['title'] ?? 'Donation'),
          icon: _foodIcon ?? BitmapDescriptor.defaultMarker,
        ),
      };
    });
  }

  void _calculateDistance() {
    if (_currentLocation == null || _donationLocation == null) return;

    final distanceInMeters = Geolocator.distanceBetween(
      _currentLocation!.latitude,
      _currentLocation!.longitude,
      _donationLocation!.latitude,
      _donationLocation!.longitude,
    );

    _distance = distanceInMeters / 1000;
    final durationHours = _distance / 30;
    _duration =
        durationHours < 1
            ? '${(durationHours * 60).round()} min'
            : '${durationHours.toStringAsFixed(1)} hours';
    print('Distance: $_distance km, Duration: $_duration');
  }

  Future<void> _getRoutePolyline() async {
    if (_currentLocation == null || _donationLocation == null) return;

    final origin =
        '${_currentLocation!.latitude},${_currentLocation!.longitude}';
    final destination =
        '${_donationLocation!.latitude},${_donationLocation!.longitude}';

    final url =
        'https://maps.googleapis.com/maps/api/directions/json?origin=$origin&destination=$destination&mode=driving&key=$_apiKey';

    final response = await http.get(Uri.parse(url));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data['routes'].isNotEmpty) {
        final points = data['routes'][0]['overview_polyline']['points'];
        PolylinePoints polylinePoints = PolylinePoints();
        List<PointLatLng> decodedPoints = polylinePoints.decodePolyline(points);

        setState(() {
          _polylines = {
            Polyline(
              polylineId: const PolylineId('route'),
              color: Colors.orange,
              width: 5,
              points:
                  decodedPoints
                      .map((p) => LatLng(p.latitude, p.longitude))
                      .toList(),
            ),
          };
        });
      }
    } else {
      print('Failed to load directions: ${response.body}');
    }
  }

  void _animateCamera(GoogleMapController controller) {
    if (_currentLocation != null && _donationLocation != null) {
      controller.animateCamera(
        CameraUpdate.newLatLngBounds(
          LatLngBounds(
            southwest: LatLng(
              _currentLocation!.latitude < _donationLocation!.latitude
                  ? _currentLocation!.latitude
                  : _donationLocation!.latitude,
              _currentLocation!.longitude < _donationLocation!.longitude
                  ? _currentLocation!.longitude
                  : _donationLocation!.longitude,
            ),
            northeast: LatLng(
              _currentLocation!.latitude > _donationLocation!.latitude
                  ? _currentLocation!.latitude
                  : _donationLocation!.latitude,
              _currentLocation!.longitude > _donationLocation!.longitude
                  ? _currentLocation!.longitude
                  : _donationLocation!.longitude,
            ),
          ),
          100,
        ),
      );
    }
  }

  Future<void> _confirmClaim() async {
    setState(() => _isProcessing = true);
    try {
      final donationId = widget.args['donationId'];
      if (donationId == null || donationId.isEmpty) {
        throw Exception('Invalid donation ID');
      }

      await _donationService.claimDonation(donationId);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Donation claimed successfully!')),
      );

      Navigator.pop(context);
      Navigator.pushReplacementNamed(context, '/available-donation');
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to claim donation: $e')));
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Donation Location'),
        backgroundColor: Colors.orange,
        actions: [
          IconButton(
            icon: const Icon(Icons.layers),
            onPressed: () {
              setState(() {
                _mapType =
                    _mapType == MapType.normal
                        ? MapType.satellite
                        : MapType.normal;
              });
            },
          ),
          IconButton(
            icon: Icon(_showTraffic ? Icons.traffic : Icons.traffic_outlined),
            onPressed: () {
              setState(() {
                _showTraffic = !_showTraffic;
              });
            },
          ),
        ],
      ),
      body:
          _isLoading
              ? const Center(child: FancyFoodLoader())
              : Column(
                children: [
                  Expanded(
                    child: GoogleMap(
                      mapType: _mapType,
                      trafficEnabled: _showTraffic,
                      initialCameraPosition: CameraPosition(
                        target: _donationLocation ?? const LatLng(0, 0),
                        zoom: 13,
                      ),
                      markers: _markers,
                      polylines: _polylines,
                      myLocationEnabled: true,
                      zoomControlsEnabled: true,
                      onMapCreated: (controller) async {
                        _controller.complete(controller);
                        _animateCamera(controller);
                        await _getRoutePolyline(); // defer to avoid early heavy load
                      },
                    ),
                  ),
                  Container(
                    color: Colors.white,
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          widget.args['title'] ?? 'Donation',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Icon(
                              Icons.location_on,
                              color: Colors.grey[600],
                              size: 16,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                widget.args['location'] ?? 'Unknown location',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Distance: ${_distance.toStringAsFixed(1)} km',
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            Text(
                              'Est. time: $_duration',
                              style: const TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Column(
                          children: [
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.orange,
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 12,
                                  ),
                                ),
                                onPressed: _isProcessing ? null : _confirmClaim,
                                child:
                                    _isProcessing
                                        ? const SizedBox(
                                          height: 20,
                                          width: 20,
                                          child: CircularProgressIndicator(
                                            color: Colors.white,
                                          ),
                                        )
                                        : const Text(
                                          'Confirm Claim',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                          ),
                                        ),
                              ),
                            ),
                            const SizedBox(height: 10),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.blue,
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 12,
                                  ),
                                ),
                                onPressed: () {
                                  if (_currentLocation != null &&
                                      _donationLocation != null) {
                                    final url =
                                        'https://www.google.com/maps/dir/?api=1&origin=${_currentLocation!.latitude},${_currentLocation!.longitude}&destination=${_donationLocation!.latitude},${_donationLocation!.longitude}&travelmode=driving';
                                    launchUrl(
                                      Uri.parse(url),
                                      mode: LaunchMode.externalApplication,
                                    );
                                  }
                                },
                                icon: const Icon(
                                  Icons.map,
                                  color: Colors.white,
                                ),
                                label: const Text(
                                  'Open in Google Maps',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
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
    );
  }
}
