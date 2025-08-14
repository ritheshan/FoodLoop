import 'dart:convert';
import 'package:foodloop_mobile/features/auth/services/auth_service.dart';
import 'package:http/http.dart' as http;

class TransactionService {
  static const String baseUrl = 'http://10.0.2.2:5000/api/transaction';
  final AuthService _authService = AuthService();
  
  Future<List<dynamic>> getUserTransactions() async {
    final token = await _authService.getAuthToken();
    if (token == null) {
      throw Exception('Authentication required');
    }
    
    final response = await http.get(
      Uri.parse(baseUrl),
      headers: {'Authorization': 'Bearer $token'},
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['transactions'];
    } else {
      throw Exception('Failed to load transactions');
    }
  }
  
  Future<Map<String, dynamic>> updateTransactionStatus(
    String transactionId, 
    String status, 
    {String? note}
  ) async {
    final token = await _authService.getAuthToken();
    if (token == null) {
      throw Exception('Authentication required');
    }
    
    final response = await http.patch(
      Uri.parse('$baseUrl/$transactionId/status'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'status': status,
        if (note != null) 'note': note,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to update status: ${response.body}');
    }
  }
}