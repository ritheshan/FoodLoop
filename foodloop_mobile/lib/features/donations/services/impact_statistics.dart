import 'dart:convert';
import 'package:foodloop_mobile/core/constants/api_constants.dart';
import 'package:http/http.dart' as http;

class ImpactService {
  
  Future<Map<String, dynamic>> getImpactStats() async {
    final response = await http.get(Uri.parse(ApiConstants.impactStatistics));
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load impact statistics');
    }
  }
}