import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class JoyMomentCard extends StatelessWidget {
  final Map<String, dynamic> moment;

  const JoyMomentCard({super.key, required this.moment});

  @override
  Widget build(BuildContext context) {
    // Extract data with safety checks
    final String caption = moment['caption']?.toString() ?? '';
    final String imageUrl = moment['publicUrl']?.toString() ?? '';
    
    // Get user information
    final user = moment['user'] as Map<String, dynamic>?;
    final String username = user?['name']?.toString() ?? 'Anonymous';
    
    // Format the date
    String formattedDate = '';
    try {
      if (moment['date'] != null) {
        final date = DateTime.parse(moment['date'].toString());
        formattedDate = DateFormat('MMM d, yyyy • h:mm a').format(date);
      }
    } catch (e) {
      formattedDate = '';
    }

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // User info and timestamp
          ListTile(
            contentPadding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
            leading: CircleAvatar(
              backgroundColor: Colors.orange.shade200,
              child: Text(
                username.isNotEmpty ? username[0].toUpperCase() : 'A',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            title: Text(
              username,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: formattedDate.isNotEmpty 
              ? Text(formattedDate)
              : null,
          ),
          
          // Caption
          if (caption.isNotEmpty)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
              child: Text(
                caption,
                style: const TextStyle(fontSize: 16),
              ),
            ),
          
          // Image
          if (imageUrl.isNotEmpty)
            ClipRRect(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(12),
                bottomRight: Radius.circular(12),
              ),
              child: Image.network(
                imageUrl,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  height: 200,
                  color: Colors.grey.shade200,
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.broken_image, size: 50, color: Colors.grey),
                        const SizedBox(height: 8),
                        Text('Could not load image', style: TextStyle(color: Colors.grey.shade600)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          
          // Interaction buttons
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildActionButton(Icons.favorite_border, 'Like', Colors.red),
                _buildActionButton(Icons.chat_bubble_outline, 'Comment', Colors.blue),
                _buildActionButton(Icons.share, 'Share', Colors.green),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildActionButton(IconData icon, String label, Color color) {
    return TextButton.icon(
      onPressed: () {},  // No action for now
      icon: Icon(icon, color: color, size: 20),
      label: Text(
        label,
        style: TextStyle(color: color),
      ),
    );
  }
}