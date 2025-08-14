import 'dart:convert';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';
import 'package:http/http.dart' as http;

class NGOService {
  static const String baseUrl = 'http://10.0.2.2:5000/api/ngo';
  final AuthService _authService = AuthService();
  
  Future<Map<String, dynamic>> claimDonation(String donationId, {String? volunteerId}) async {
    final token = await _authService.getAuthToken();
    if (token == null) {
      throw Exception('Authentication required');
    }
    
    final response = await http.post(
      Uri.parse('$baseUrl/claim/$donationId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        if (volunteerId != null) 'volunteerId': volunteerId,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to claim donation: ${response.body}');
    }
  }
  
  Future<Map<String, dynamic>> updatePreferences(
    List<String> foodPreferences, 
    bool needsVolunteer
  ) async {
    final token = await _authService.getAuthToken();
    if (token == null) {
      throw Exception('Authentication required');
    }
    
    final response = await http.patch(
      Uri.parse('$baseUrl/preferences'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'foodPreferences': foodPreferences,
        'needsVolunteer': needsVolunteer,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update preferences: ${response.body}');
    }
  }
}