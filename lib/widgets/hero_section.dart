import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme.dart';
import 'knife_painter.dart';

class HeroSection extends StatefulWidget {
  final ScrollController scrollController;

  const HeroSection({super.key, required this.scrollController});

  @override
  State<HeroSection> createState() => _HeroSectionState();
}

class _HeroSectionState extends State<HeroSection> with TickerProviderStateMixin {
  late AnimationController _repairController;
  late AnimationController _shimmerController;
  late AnimationController _glintController;
  bool _isRepaired = false;

  final List<_WaterDrop> _drops = [];
  Timer? _dropTimer;
  final Random _random = Random();

  @override
  void initState() {
    super.initState();

    _repairController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    _glintController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    widget.scrollController.addListener(_onScroll);

    _dropTimer = Timer.periodic(const Duration(milliseconds: 80), (_) {
      if (mounted) _spawnDrops();
    });
  }

  void _onScroll() {
    final scrollY = widget.scrollController.offset;
    if (scrollY > 80 && !_isRepaired) {
      _isRepaired = true;
      _repairController.forward();
    } else if (scrollY <= 80 && _isRepaired) {
      _isRepaired = false;
      _repairController.reverse();
    }
  }

  void _spawnDrops() {
    setState(() {
      for (int i = 0; i < 2; i++) {
        _drops.add(_WaterDrop(
          x: 0.3 + _random.nextDouble() * 0.4,
          duration: 3000 + _random.nextInt(2000),
          size: 2 + _random.nextDouble() * 4,
          driftX: (_random.nextDouble() - 0.5) * 60,
          createdAt: DateTime.now(),
        ));
      }
      _drops.removeWhere((d) =>
        DateTime.now().difference(d.createdAt).inMilliseconds > 5000);
    });
  }

  @override
  void dispose() {
    _repairController.dispose();
    _shimmerController.dispose();
    _glintController.dispose();
    _dropTimer?.cancel();
    widget.scrollController.removeListener(_onScroll);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 768;
    final knifHeight = isMobile ? 320.0 : 420.0;
    final knifWidth = knifHeight * (200 / 650);

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF1e2226), AppColors.fond],
        ),
      ),
      padding: EdgeInsets.only(
        top: 100,
        bottom: 60,
        left: isMobile ? 20 : 40,
        right: isMobile ? 20 : 40,
      ),
      child: Column(
        children: [
          // Titre shimmer
          AnimatedBuilder(
            animation: _shimmerController,
            builder: (context, child) {
              final pos = _shimmerController.value;
              return ShaderMask(
                shaderCallback: (bounds) => LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: const [
                    AppColors.chene,
                    Colors.white,
                    AppColors.chene,
                  ],
                  stops: [
                    (pos - 0.25).clamp(0.0, 1.0),
                    pos.clamp(0.0, 1.0),
                    (pos + 0.25).clamp(0.0, 1.0),
                  ],
                ).createShader(bounds),
                child: child!,
              );
            },
            child: Text(
              'KEN AIGUISE',
              textAlign: TextAlign.center,
              style: GoogleFonts.cinzel(
                fontSize: isMobile ? 32 : 52,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: isMobile ? 6 : 10,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Affûteur • Lyon 4',
            style: GoogleFonts.cinzel(
              fontSize: isMobile ? 13 : 16,
              color: AppColors.acier,
              letterSpacing: 4,
            ),
          ),
          const SizedBox(height: 30),

          // Couteau animé
          SizedBox(
            width: knifWidth,
            height: knifHeight,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Particules d'eau
                ..._drops.map((drop) {
                  final elapsed = DateTime.now().difference(drop.createdAt).inMilliseconds;
                  final progress = (elapsed / drop.duration).clamp(0.0, 1.0);
                  final opacity = progress < 0.5
                      ? progress * 2
                      : (1 - progress) * 2;
                  return Positioned(
                    left: knifWidth * drop.x + drop.driftX * progress - drop.size / 2,
                    top: knifHeight * 0.6 - progress * knifHeight * 0.5,
                    child: Opacity(
                      opacity: opacity.clamp(0.0, 1.0),
                      child: Container(
                        width: drop.size,
                        height: drop.size * 1.5,
                        decoration: BoxDecoration(
                          color: AppColors.bleuMetal.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(drop.size),
                        ),
                      ),
                    ),
                  );
                }),

                // SVG couteau via CustomPaint
                AnimatedBuilder(
                  animation: _repairController,
                  builder: (context, child) {
                    return CustomPaint(
                      size: Size(knifWidth, knifHeight),
                      painter: KnifePainter(_repairController.value),
                    );
                  },
                ),

                // Logo sur la lame
                AnimatedBuilder(
                  animation: _repairController,
                  builder: (context, child) {
                    final progress = _repairController.value;
                    return Positioned(
                      top: knifHeight * (320 / 650),
                      left: knifWidth * (78 / 200),
                      child: Opacity(
                        opacity: 0.3 + progress * 0.7,
                        child: Transform.translate(
                          offset: Offset(0, progress * 3),
                          child: Image.asset(
                            'assets/images/logo.svg',
                            width: knifWidth * (75 / 200),
                            height: knifWidth * (75 / 200),
                            errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 30),

          // Bouton Instagram
          GestureDetector(
            onTap: () => launchUrl(Uri.parse('https://www.instagram.com/ken_aiguise/')),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.chene),
                borderRadius: BorderRadius.circular(2),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.photo_camera_outlined, color: AppColors.chene, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    'Me suivre',
                    style: GoogleFonts.cinzel(
                      color: AppColors.chene,
                      fontSize: 11,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _WaterDrop {
  final double x;
  final int duration;
  final double size;
  final double driftX;
  final DateTime createdAt;

  _WaterDrop({
    required this.x,
    required this.duration,
    required this.size,
    required this.driftX,
    required this.createdAt,
  });
}
