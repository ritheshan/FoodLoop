class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? organizationName;
  final String? contactNumber;
  final String? address;
  
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.organizationName,
    this.contactNumber,
    this.address,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'],
      name: json['name'],
      email: json['email'],
      role: json['role'],
      organizationName: json['organizationName'],
      contactNumber: json['contactNumber'],
      address: json['address'],
    );
  }
}