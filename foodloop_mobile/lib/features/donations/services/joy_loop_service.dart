import 'dart:convert';
import 'package:foodloop_mobile/core/constants/api_constants.dart';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';
import 'package:http/http.dart' as http;
import 'dart:io';
import 'dart:developer';

class JoyLoopService {
  
  final AuthService _authService = AuthService();
  
  Future<List<dynamic>> getJoyMoments() async {
  try {
    final token = await _authService.getAuthToken();
    
    final response = await http.get(
      Uri.parse(ApiConstants.joyMoments),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    
    log('Joy moments response status: ${response.statusCode}');
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      log('Joy moments raw data type: ${data.runtimeType}');
      
      // Handle the specific response structure you're receiving
      if (data is Map<String, dynamic> && 
          data.containsKey('success') && 
          data.containsKey('data') && 
          data['data'] is Map<String, dynamic> &&
          data['data'].containsKey('momentOfDay')) {
        
        return data['data']['momentOfDay'] as List<dynamic>;
      }
      
      // Fallback to standard formats
      if (data is List) {
        return data;
      } else if (data is Map<String, dynamic>) {
        if (data.containsKey('data') && data['data'] is List) {
          return data['data'] as List;
        } else if (data.containsKey('moments')) {
          return data['moments'] as List;
        } else {
          // Look for any list in the response
          for (var key in data.keys) {
            if (data[key] is List) {
              return data[key] as List;
            }
          }
        }
      }
      
      log('No suitable list found in response');
      return [];
    } else {
      throw Exception('Failed to load joy moments: ${response.statusCode}');
    }
  } catch (e) {
    log('Error in getJoyMoments: $e');
    throw Exception('Failed to load joy moments: $e');
  }
}
  
  Future<List<dynamic>> getTopDonors() async {
    try {
      final token = await _authService.getAuthToken();
    
    final response = await http.get(
      Uri.parse(ApiConstants.topDonors),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
      
      log('Top donors response: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Handle different response formats
        if (data is List) {
          return data;
        } else if (data is Map<String, dynamic>) {
          if (data.containsKey('data')) {
            return data['data'] as List<dynamic>;
          } else if (data.containsKey('donors')) {
            return data['donors'] as List<dynamic>;
          } else {
            // Try to find any list in the response
            for (var value in data.values) {
              if (value is List) {
                return value;
              }
            }
          }
        }
        
        log('Unexpected top donors response format: $data');
        return [];
      } else {
        throw Exception('Failed to load top donors: ${response.statusCode}');
      }
    } catch (e) {
      log('Error in getTopDonors: $e');
      throw Exception('Failed to load top donors: $e');
    }
  }
  
  Future<List<dynamic>> getJoySpreaders() async {
    try {
      final response = await http.get(Uri.parse(ApiConstants.joySpreaders));
      
      log('Joy spreaders response: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        // Handle different response formats
        if (data is List) {
          return data;
        } else if (data is Map<String, dynamic>) {
          if (data.containsKey('data')) {
            return data['data'] as List<dynamic>;
          } else if (data.containsKey('spreaders')) {
            return data['spreaders'] as List<dynamic>;
          } else {
            // Try to find any list in the response
            for (var value in data.values) {
              if (value is List) {
                return value;
              }
            }
          }
        }
        
        log('Unexpected joy spreaders response format: $data');
        return [];
      } else {
        throw Exception('Failed to load joy spreaders: ${response.statusCode}');
      }
    } catch (e) {
      log('Error in getJoySpreaders: $e');
      throw Exception('Failed to load joy spreaders: $e');
    }
  }
  
  Future<Map<String, dynamic>> postJoyMoment(String content, File? mediaFile) async {
    // This method can remain unchanged as it's returning Map<String, dynamic>
    final token = await _authService.getAuthToken();
    if (token == null) {
      throw Exception('Authentication required');
    }
    
    var request = http.MultipartRequest(
      'POST',
      Uri.parse(ApiConstants.joyPost),
    );
    
    request.headers['Authorization'] = 'Bearer $token';
    request.fields['content'] = content;
    
    if (mediaFile != null) {
      request.files.add(await http.MultipartFile.fromPath(
        'media',
        mediaFile.path,
      ));
    }
    
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);
    
    if (response.statusCode == 200 || response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to post joy moment: ${response.body}');
    }
  }
}