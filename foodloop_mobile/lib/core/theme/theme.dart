
import 'package:flutter/material.dart';
import 'package:foodloop_mobile/core/theme/app_pallete.dart';

class AppTheme {
  static _border([Color color = AppPallete.borderColor]) => OutlineInputBorder(
    borderSide: BorderSide(color: color, width: 3),
    borderRadius: BorderRadius.circular(10),
  );
  static final lightThemeMode = ThemeData.dark().copyWith(
    scaffoldBackgroundColor: AppPallete.gradient1,
    appBarTheme: AppBarTheme(
      backgroundColor: AppPallete.gradient1,
      foregroundColor: AppPallete.gradient1,
      iconTheme: IconThemeData(color: AppPallete.gradient1),
      elevation: 0,
    ),
    chipTheme: ChipThemeData(
      color: WidgetStateProperty.all(AppPallete.primaryFgColor),
      side: BorderSide.none,
    ),
    colorScheme: ColorScheme.fromSwatch().copyWith(
      primary: AppPallete.gradient1,
      secondary: AppPallete.gradient1,
      error: AppPallete.errorColor,
    ),
    textTheme: TextTheme(
      bodyLarge: TextStyle(color: AppPallete.backgroundColor),
      bodyMedium: TextStyle(color: AppPallete.backgroundColor),
      displayLarge: TextStyle(color: AppPallete.backgroundColor),
      displaySmall: TextStyle(color: AppPallete.backgroundColor),
      headlineMedium: TextStyle(color: AppPallete.backgroundColor),
      headlineSmall: TextStyle(color: AppPallete.backgroundColor),
      displayMedium: TextStyle(color: AppPallete.backgroundColor),
      titleLarge: TextStyle(color: AppPallete.backgroundColor),
    ),
    inputDecorationTheme: InputDecorationTheme(
      contentPadding: EdgeInsets.all(27),
      border: _border(),
      enabledBorder: _border(),
      focusedBorder: _border(AppPallete.gradient2),
      errorBorder: _border(AppPallete.errorColor),
    ),
  );
}
