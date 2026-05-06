import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class FooterWidget extends StatelessWidget {
  const FooterWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment.center,
          radius: 1.0,
          colors: [Color(0xFF23272a), AppColors.fond],
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 30),
      child: Column(
        children: [
          Text(
            'KEN AIGUISE',
            style: GoogleFonts.cinzel(
              color: AppColors.chene,
              fontSize: 18,
              letterSpacing: 4,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '74 Rue d\'Ypres, 69004 Lyon',
            style: GoogleFonts.cinzel(color: AppColors.acier, fontSize: 12),
          ),
          const SizedBox(height: 20),
          Text(
            '© 2026 — Affûtage de précision sur Diamant',
            style: GoogleFonts.cinzel(
              color: AppColors.acier.withOpacity(0.5),
              fontSize: 10,
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }
}
