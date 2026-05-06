import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const KenAiguiseApp());
}

class KenAiguiseApp extends StatelessWidget {
  const KenAiguiseApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Ken Aiguise | L'Art du Tranchant",
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: const ColorScheme.dark(
          surface: AppColors.fond,
          primary: AppColors.chene,
          secondary: AppColors.acier,
        ),
        scaffoldBackgroundColor: AppColors.fond,
        textTheme: GoogleFonts.cinzelTextTheme(ThemeData.dark().textTheme).apply(
          bodyColor: AppColors.texte,
          displayColor: AppColors.texte,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
