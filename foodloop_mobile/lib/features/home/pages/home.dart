import 'package:flutter/material.dart';
import 'package:foodloop_mobile/core/theme/app_pallete.dart';



class Home extends StatelessWidget {
  const Home({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppPallete.gradient1,
      appBar: AppBar(
        backgroundColor: AppPallete.gradient1,
        title: Text(
          'FoodLoop',
          style: TextStyle(
            color: AppPallete.primaryColor,
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppPallete.gradient1,
              AppPallete.gradient1,
            ],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              // Welcome text
              Text(
                'Welcome to FoodLoop',
                style: TextStyle(
                  color: AppPallete.textColor,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Reduce food waste, help those in need',
                style: TextStyle(
                  color: AppPallete.textColor,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 40),
              // Main menu buttons
              buildHomeButton(
                context, 
                'List Food', 
                '/list-food',
                AppPallete.primaryColor,
                Icons.fastfood,
              ),
              buildHomeButton(
                context, 
                'My Donations', 
                '/donation-history',
                AppPallete.primaryColor,
                Icons.volunteer_activism,
              ),
              buildHomeButton(
                context, 
                'Find NGOs', 
                '/ngo-finder',
                AppPallete.primaryColor,
                Icons.location_on,
              ),
              const SizedBox(height: 20),
              // Stats card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppPallete.secondaryColor.withOpacity(0.7),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppPallete.borderColor,
                    width: 1,
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Your Impact',
                      style: TextStyle(
                        color: AppPallete.accentColor,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildStatItem('5', 'Donations'),
                        _buildStatItem('12 kg', 'Food Saved'),
                        _buildStatItem('3', 'NGOs Helped'),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: AppPallete.gradient1,
        selectedItemColor: AppPallete.primaryColor,
        unselectedItemColor: AppPallete.greyColor,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: AppPallete.whiteColor,
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: AppPallete.greyColor,
            fontSize: 14,
          ),
        ),
      ],
    );
  }
  
  Widget buildHomeButton(
    BuildContext context, 
    String title, 
    String route, 
    Color color,
    IconData icon,
  ) => Container(
    margin: const EdgeInsets.only(bottom: 16),
    child: ElevatedButton(
      onPressed: () => Navigator.pushNamed(context, route),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        foregroundColor: AppPallete.textColor,
        padding: const EdgeInsets.symmetric(vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 3,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 24),
          const SizedBox(width: 12),
          Text(
            title, 
            style: const TextStyle(
              fontSize: 18, 
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    ),
  );
}