import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class GallerySection extends StatefulWidget {
  const GallerySection({super.key});

  @override
  State<GallerySection> createState() => _GallerySectionState();
}

class _GallerySectionState extends State<GallerySection> {
  int _activeIndex = 0;
  double? _dragStartX;

  static const _items = [
    _GalleryItem(asset: 'assets/images/knife_1.webp', label: 'Avant', labelColor: Color(0xFFE13F7C)),
    _GalleryItem(asset: 'assets/images/knife_2.webp', label: 'Après', labelColor: Color(0xFF67C090)),
    _GalleryItem(asset: 'assets/images/atelier.webp', label: "L'Atelier", labelColor: AppColors.chene),
  ];

  void _activate(int index) => setState(() => _activeIndex = index);

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;

    return Container(
      color: AppColors.fond,
      padding: EdgeInsets.symmetric(vertical: 70, horizontal: isMobile ? 20 : 60),
      child: Column(
        children: [
          _sectionTitle('Galerie'),
          const SizedBox(height: 30),
          GestureDetector(
            onHorizontalDragStart: (d) => _dragStartX = d.globalPosition.dx,
            onHorizontalDragEnd: (d) {
              if (_dragStartX == null) return;
              final dx = d.globalPosition.dx - _dragStartX!;
              if (dx.abs() > 50) {
                if (dx < 0 && _activeIndex < _items.length - 1) {
                  _activate(_activeIndex + 1);
                } else if (dx > 0 && _activeIndex > 0) {
                  _activate(_activeIndex - 1);
                }
              }
              _dragStartX = null;
            },
            child: SizedBox(
              height: isMobile ? 260 : 360,
              child: Row(
                children: List.generate(_items.length, (i) {
                  final isActive = i == _activeIndex;
                  return Expanded(
                    flex: isActive ? 5 : 1,
                    child: GestureDetector(
                      onTap: () => _activate(i),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 500),
                        curve: Curves.easeInOut,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        clipBehavior: Clip.antiAlias,
                        decoration: BoxDecoration(borderRadius: BorderRadius.circular(4)),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            AnimatedOpacity(
                              duration: const Duration(milliseconds: 400),
                              opacity: isActive ? 1.0 : 0.5,
                              child: ColorFiltered(
                                colorFilter: isActive
                                    ? const ColorFilter.mode(Colors.transparent, BlendMode.color)
                                    : const ColorFilter.matrix([
                                        0.2126, 0.7152, 0.0722, 0, 0,
                                        0.2126, 0.7152, 0.0722, 0, 0,
                                        0.2126, 0.7152, 0.0722, 0, 0,
                                        0, 0, 0, 1, 0,
                                      ]),
                                child: Image.asset(
                                  _items[i].asset,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Container(
                                    color: AppColors.fondCard,
                                    child: const Icon(Icons.image, color: AppColors.acier),
                                  ),
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: 0,
                              left: 0,
                              right: 0,
                              child: AnimatedSlide(
                                duration: const Duration(milliseconds: 400),
                                offset: isActive ? Offset.zero : const Offset(0, 1),
                                child: Container(
                                  decoration: const BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.bottomCenter,
                                      end: Alignment.topCenter,
                                      colors: [Colors.black87, Colors.transparent],
                                    ),
                                  ),
                                  padding: const EdgeInsets.all(16),
                                  child: Text(
                                    _items[i].label,
                                    style: GoogleFonts.cinzel(
                                      color: _items[i].labelColor,
                                      fontSize: 14,
                                      letterSpacing: 2,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_items.length, (i) {
              return GestureDetector(
                onTap: () => _activate(i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 5),
                  width: i == _activeIndex ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: i == _activeIndex ? AppColors.chene : AppColors.acier.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}

class _GalleryItem {
  final String asset;
  final String label;
  final Color labelColor;

  const _GalleryItem({
    required this.asset,
    required this.label,
    required this.labelColor,
  });
}

Widget _sectionTitle(String title) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Text(
        title,
        style: GoogleFonts.cinzel(
          fontSize: 26,
          fontWeight: FontWeight.bold,
          color: AppColors.texte,
          letterSpacing: 3,
        ),
      ),
    ],
  );
}
