import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';
import '../services/donation_service.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class DonateScreen extends StatefulWidget {
  const DonateScreen({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _DonateScreenState createState() => _DonateScreenState();
}

class _DonateScreenState extends State<DonateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _donationService = DonationService();
  final authService = AuthService();
  final ImagePicker _picker = ImagePicker();
  
  bool _isSubmitting = false;
  bool _isLoadingLocation = false;
  String? _locationError;
  
  late String token;
  late String userId;
  String _foodDescription = '';
  double _hoursOld = 1.0;
  String _storage = 'room temp';
  String _weight = '';
  DateTime _expirationDate = DateTime.now().add(Duration(days: 1));
  List<double> _location = [0, 0]; // [lng, lat]
  String _role = '';
  List<XFile> _images = []; // To store picked images

  Future<void> _getCurrentLocation() async {
    setState(() {
      _isLoadingLocation = true;
      _locationError = null;
    });

    try {
      // Request location permissions
      final permissionStatus = await Permission.location.request();
      
      if (permissionStatus.isGranted) {
        // Get current position
        final position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high
        );
        
        setState(() {
          // Store as [longitude, latitude] as expected by backend
          _location = [position.longitude, position.latitude];
          _isLoadingLocation = false;
        });
        
        print("Location captured: lng: ${_location[0]}, lat: ${_location[1]}");
      } else {
        setState(() {
          _locationError = 'Location permission denied';
          _isLoadingLocation = false;
        });
      }
    } catch (e) {
      setState(() {
        _locationError = 'Failed to get location: $e';
        _isLoadingLocation = false;
      });
      print("Location error: $e");
    }
  }

    Future<void> _submitDonation() async {
  if (!_formKey.currentState!.validate()) return;
  
  if (_images.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Please add at least one image of the food'))
    );
    return;
  }
  
  // Check if location is set
  if (_location[0] == 0 && _location[1] == 0) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Please get your current location first'))
    );
    return;
  }
  
  _formKey.currentState!.save();

  setState(() => _isSubmitting = true);

  try {
    // Get user ID - using a hardcoded ID for now since you have it in your code
    // In a production app, you should get this from proper authentication
    log('Location: $_location');
    
    // Convert XFiles to Files for upload
    final imageFiles = _images.map((xFile) => File(xFile.path)).toList();
    
    // Important: Send lat and lng as separate fields rather than as an array
    final donationData = {
      'foodDescription': _foodDescription,
      'foodType': _foodDescription, // Assuming food type is always 'food'
      'hoursOld': _hoursOld.toString(),
      'storage': _storage,
      'weight': _weight,
      'expirationDate': _expirationDate.toIso8601String(),
      'lat': _location[1].toString(), // Send latitude as a string
      'lng': _location[0].toString(), // Send longitude as a string // Include donor ID explicitly
    };
    
    log('Sending donation data: $donationData');
    
    final result = await _donationService.createDonation(donationData, imageFiles);
    
    print('Donation created: $result');
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Donation created successfully!')));

    // Clear the form or navigate back
    Navigator.pop(context);
  } catch (e) {
    print('Error creating donation: $e');
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Error creating donation: $e')));
  } finally {
    setState(() => _isSubmitting = false);
  }
}

  // Function to pick images
  Future<void> _pickImages() async {
    final List<XFile>? selectedImages = await _picker.pickMultiImage();
    if (selectedImages != null && selectedImages.isNotEmpty) {
      setState(() {
        _images = selectedImages;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _loadUserData();
    // Try to get location when the screen opens
    _getCurrentLocation();
  }

  Future<void> _loadUserData() async {
    token = (await authService.getAuthToken())!;
    userId = (await authService.getUserId())!;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Donate Food'),
        backgroundColor: Colors.orange,
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16.0),
          children: [
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Food Description',
                hintText: 'E.g., Fresh sandwiches, pasta, etc.',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a food description';
                }
                return null;
              },
              onSaved: (value) => _foodDescription = value!,
            ),
            SizedBox(height: 16),
            Text('How old is the food? (hours)'),
            Slider(
              value: _hoursOld,
              min: 0,
              max: 24,
              divisions: 24,
              label: _hoursOld.round().toString(),
              onChanged: (value) {
                setState(() => _hoursOld = value);
              },
            ),
            SizedBox(height: 16),

            // Image picker section
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Upload Food Images',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Please upload at least one image of the food',
                      style: TextStyle(color: Colors.grey),
                    ),
                    SizedBox(height: 16),
                    _images.isEmpty
                        ? Center(
                            child: TextButton.icon(
                              icon: Icon(Icons.add_a_photo),
                              label: Text('Add Photos'),
                              onPressed: _pickImages,
                            ),
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                height: 100,
                                child: ListView.builder(
                                  scrollDirection: Axis.horizontal,
                                  itemCount: _images.length + 1, // +1 for add button
                                  itemBuilder: (context, index) {
                                    if (index == _images.length) {
                                      return Container(
                                        width: 100,
                                        margin: EdgeInsets.only(right: 8),
                                        child: IconButton(
                                          icon: Icon(Icons.add_circle_outline),
                                          onPressed: _pickImages,
                                        ),
                                      );
                                    }
                                    return Stack(
                                      children: [
                                        Container(
                                          width: 100,
                                          margin: EdgeInsets.only(right: 8),
                                          decoration: BoxDecoration(
                                            border: Border.all(color: Colors.grey),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Image.file(
                                            File(_images[index].path),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                        Positioned(
                                          right: 0,
                                          top: 0,
                                          child: IconButton(
                                            icon: Icon(Icons.remove_circle, color: Colors.red),
                                            onPressed: () {
                                              setState(() {
                                                _images.removeAt(index);
                                              });
                                            },
                                          ),
                                        ),
                                      ],
                                    );
                                  },
                                ),
                              ),
                              SizedBox(height: 8),
                              Text('${_images.length} image(s) selected'),
                            ],
                          ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),

            // Location section
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Your Location',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    if (_locationError != null)
                      Text(
                        _locationError!,
                        style: TextStyle(color: Colors.red),
                      ),
                    if (_location[0] != 0 || _location[1] != 0)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Text(
                          'Location captured: Longitude: ${_location[0].toStringAsFixed(6)}, Latitude: ${_location[1].toStringAsFixed(6)}',
                          style: TextStyle(color: Colors.green),
                        ),
                      ),
                    Center(
                      child: ElevatedButton.icon(
                        onPressed: _isLoadingLocation ? null : _getCurrentLocation,
                        icon: Icon(_isLoadingLocation ? Icons.hourglass_empty : Icons.my_location),
                        label: Text(_isLoadingLocation ? 'Getting location...' : 'Get My Current Location'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blueAccent,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 16),

            // Rest of the form remains the same
            DropdownButtonFormField<String>(
              decoration: InputDecoration(
                labelText: 'Storage Condition',
                border: OutlineInputBorder(),
              ),
              value: _storage,
              items:
                  ['room temp', 'refrigerated', 'frozen'].map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value.toUpperCase()),
                    );
                  }).toList(),
              onChanged: (value) {
                setState(() => _storage = value!);
              },
            ),
            SizedBox(height: 16),
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Weight (kg)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter the weight';
                }
                return null;
              },
              onSaved: (value) => _weight = value!,
            ),
            SizedBox(height: 16),
            ListTile(
              title: Text('Expiration Date'),
              subtitle: Text(DateFormat('yyyy-MM-dd').format(_expirationDate)),
              trailing: Icon(Icons.calendar_today),
              onTap: () async {
                final DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: _expirationDate,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(Duration(days: 30)),
                );
                if (picked != null) {
                  setState(() => _expirationDate = picked);
                }
              },
            ),
            SizedBox(height: 32),
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submitDonation,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                padding: EdgeInsets.symmetric(vertical: 16),
              ),
              child:
                  _isSubmitting
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text('DONATE NOW'),
            ),
          ],
        ),
      ),
    );
  }
}
