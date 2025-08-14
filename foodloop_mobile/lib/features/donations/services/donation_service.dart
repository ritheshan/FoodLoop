import 'dart:convert';
import 'dart:developer';
import 'dart:io';
import 'package:foodloop_mobile/core/constants/api_constants.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';

class DonationService {
  final AuthService _authService = AuthService();

  Future<Map<String, dynamic>> createDonation(
  Map<String, dynamic> donationData,
  List<File> images,
) async {
  try {
    final token = await _authService.getAuthToken();

    if (token == null) {
      throw Exception('Authentication token not found');
    }

    final uri = Uri.parse(ApiConstants.createDonation);
    final request = http.MultipartRequest('POST', uri);

    // Add headers
    request.headers.addAll({
      'Authorization': 'Bearer $token',
      'Content-Type': 'multipart/form-data',
    });
    print('Request headers: ${donationData}');

    // EXPLICITLY SET THE REQUIRED foodType field
    if (!donationData.containsKey('foodType') || donationData['foodType'] == null || donationData['foodType'].toString().trim().isEmpty) {
      // Use foodDescription as foodType if it exists
      if (donationData.containsKey('foodDescription') && donationData['foodDescription'] != null) {
        request.fields['foodType'] = donationData['foodDescription'].toString();
        log('Setting foodType from foodDescription: ${donationData['foodDescription']}');
      } else {
        // Fallback to a default value
        request.fields['foodType'] = 'General Food Item';
        log('Setting default foodType: General Food Item');
      }
    } else {
      // Use the provided foodType
      request.fields['foodType'] = donationData['foodType'].toString();
      log('Using provided foodType: ${donationData['foodType']}');
    }

    // Also explicitly set fullAddress if it's missing
    if (!donationData.containsKey('fullAddress') || donationData['fullAddress'] == null || donationData['fullAddress'].toString().trim().isEmpty) {
      // Create a placeholder based on coordinates
      if (donationData.containsKey('lat') && donationData.containsKey('lng')) {
        request.fields['fullAddress'] = 'Location at ${donationData['lat']}, ${donationData['lng']}';
        log('Setting fullAddress from coordinates: ${request.fields['fullAddress']}');
      } else {
        request.fields['fullAddress'] = 'Address not provided';
        log('Setting default fullAddress: Address not provided');
      }
    } else {
      request.fields['fullAddress'] = donationData['fullAddress'].toString();
    }

    // Add all other donation data fields
    donationData.forEach((key, value) {
      if (key != 'foodType' && key != 'fullAddress') { // Skip these as we've already handled them
        request.fields[key] = value.toString();
      }
    });

    // Log request for debugging
    log('Creating donation with fields: ${request.fields}');
    log('Headers: ${request.headers}');

    // Add image files
    for (var i = 0; i < images.length; i++) {
      final file = images[i];
      final fileName = file.path.split('/').last;
      final fileExtension = fileName.split('.').last.toLowerCase();
      
      final multipartFile = await http.MultipartFile.fromPath(
        'images', // Field name that server expects
        file.path,
        filename: 'image_$i.$fileExtension',
        contentType: MediaType('image', fileExtension),
      );

      request.files.add(multipartFile);
    }

    log('Files count: ${request.files.length}');

    // Send the request
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    log('Response status: ${response.statusCode}');
    log('Response body: ${response.body}');

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to create donation: ${response.body}');
    }

    return json.decode(response.body);
  } catch (e) {
    log('Error in createDonation: $e');
    throw Exception('Failed to create donation: $e');
  }
}

  Future<List<dynamic>> getAvailableDonations() async {
  try {
    final token = await _authService.getAuthToken();
    
    if (token == null) {
      throw Exception('Authentication token not found');
    }

    final response = await http.get(
      Uri.parse(ApiConstants.listDonations),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    
    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body);
      
      // Log response structure for debugging
      log('Response structure: ${data.keys}');
      
      // Extract the donations list
      List<dynamic> donations = [];
      
      if (data.containsKey('success') && data.containsKey('data')) {
        donations = data['data'] as List<dynamic>;
      } else if (data.containsKey('donations')) {
        donations = data['donations'] as List<dynamic>;
      } else if (data is Map && data.values.isNotEmpty && data.values.first is List) {
        donations = data.values.first as List<dynamic>;
      } else {
        log('Unexpected response format: $data');
        throw Exception('Unexpected response format');
      }
      
      // Log the first donation structure to understand the format
      if (donations.isNotEmpty) {
        log('First donation structure: ${donations[0].runtimeType}');
        log('First donation keys: ${(donations[0] as Map).keys.toList()}');
        if (donations[0]['location'] != null) {
          log('Location format: ${donations[0]['location'].runtimeType}: ${donations[0]['location']}');
        }
      }
      
      return donations;
    } else {
      throw Exception('Failed to load donations: ${response.statusCode}');
    }
  } catch (e) {
    log('Error in getAvailableDonations: $e');
    throw Exception('Failed to load donations: $e');
  }
}

  Future<Map<String, dynamic>> claimDonation(String donationId) async {
  try {
    final token = await _authService.getAuthToken();
    
    if (token == null) {
      throw Exception('Authentication token not found');
    }

    // Use the correct endpoint as per your backend's route
    final response = await http.post(
      Uri.parse('${ApiConstants.baseUrl}/ngo/claim/$donationId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    
    log('Claim donation response: ${response.statusCode}, ${response.body}');
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      log('Error claiming donation: ${response.statusCode}, ${response.body}');
      throw Exception('Failed to claim donation: ${response.reasonPhrase}');
    }
  } catch (e) {
    log('Error in claimDonation: $e');
    throw Exception('Failed to claim donation: $e');
  }
}

// Add a method to get user's claimed transactions/donations
Future<List<dynamic>> getUserTransactions() async {
  try {
    final token = await _authService.getAuthToken();
    
    if (token == null) {
      throw Exception('Authentication token not found');
    }

    final response = await http.get(
      Uri.parse('${ApiConstants.baseUrl}/transaction'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    
    if (response.statusCode == 200) {
      final responseData = jsonDecode(response.body);
      
      if (responseData is Map<String, dynamic> && responseData.containsKey('transactions')) {
        return responseData['transactions'] as List<dynamic>;
      } else if (responseData is Map<String, dynamic> && responseData.containsKey('success') && 
                responseData.containsKey('transactions')) {
        return responseData['transactions'] as List<dynamic>;
      } else if (responseData is List) {
        return responseData;
      }
      
      log('Unexpected response format in getUserTransactions: $responseData');
      return [];
    } else {
      throw Exception('Failed to load transactions: ${response.statusCode}');
    }
  } catch (e) {
    log('Error in getUserTransactions: $e');
    throw Exception('Failed to load user transactions: $e');
  }
}
}
