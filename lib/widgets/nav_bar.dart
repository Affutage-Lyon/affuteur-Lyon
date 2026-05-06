import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class NavBar extends StatefulWidget {
  final ScrollController scrollController;
  final Map<String, GlobalKey> sectionKeys;

  const NavBar({super.key, required this.scrollController, required this.sectionKeys});

  @override
  State<NavBar> createState() => _NavBarState();
}

class _NavBarState extends State<NavBar> {
  bool _menuOpen = false;
  String _activeSection = 'galerie';

  @override
  void initState() {
    super.initState();
    widget.scrollController.addListener(_trackScroll);
  }

  void _trackScroll() {
    final offset = widget.scrollController.offset;
    widget.sectionKeys.forEach((name, key) {
      final ctx = key.currentContext;
      if (ctx == null) return;
      final box = ctx.findRenderObject() as RenderBox?;
      if (box == null) return;
      final pos = box.localToGlobal(Offset.zero).dy + offset;
      if (offset >= pos - 120) {
        if (_activeSection != name) setState(() => _activeSection = name);
      }
    });
  }

  void _scrollTo(String section) {
    setState(() => _menuOpen = false);
    final key = widget.sectionKeys[section];
    if (key?.currentContext == null) return;
    Scrollable.ensureVisible(
      key!.currentContext!,
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    widget.scrollController.removeListener(_trackScroll);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isMobile = screenWidth < 1024;

    return Stack(
      children: [
        // Barre de navigation fixe
        Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: Container(
            height: 50,
            decoration: BoxDecoration(
              color: const Color(0xFF1e2226).withOpacity(0.98),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 30)],
            ),
            child: isMobile ? _mobileNav() : _desktopNav(),
          ),
        ),

        // Menu mobile overlay
        if (_menuOpen && isMobile)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            child: GestureDetector(
              onTap: () => setState(() => _menuOpen = false),
              child: Container(
                color: Colors.black.withOpacity(0.85),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/logo.svg',
                      width: 60,
                      height: 60,
                      errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                    ),
                    const SizedBox(height: 40),
                    ..._navItems().map((item) => GestureDetector(
                          onTap: () => _scrollTo(item.$1),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Text(
                              item.$2,
                              style: GoogleFonts.cinzel(
                                color: _activeSection == item.$1
                                    ? AppColors.chene
                                    : AppColors.acier,
                                fontSize: 16,
                                letterSpacing: 3,
                              ),
                            ),
                          ),
                        )),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _mobileNav() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Padding(
          padding: const EdgeInsets.only(right: 15),
          child: GestureDetector(
            onTap: () => setState(() => _menuOpen = !_menuOpen),
            child: SizedBox(
              width: 30,
              height: 50,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: 24,
                    height: 2,
                    decoration: BoxDecoration(
                      color: AppColors.chene,
                      borderRadius: BorderRadius.circular(1),
                    ),
                    transform: _menuOpen
                        ? (Matrix4.rotationZ(0.785)..translate(0.0, 8.0))
                        : Matrix4.identity(),
                  ),
                  const SizedBox(height: 6),
                  AnimatedOpacity(
                    duration: const Duration(milliseconds: 200),
                    opacity: _menuOpen ? 0 : 1,
                    child: Container(
                      width: 24,
                      height: 2,
                      decoration: BoxDecoration(
                        color: AppColors.chene,
                        borderRadius: BorderRadius.circular(1),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    width: 24,
                    height: 2,
                    decoration: BoxDecoration(
                      color: AppColors.chene,
                      borderRadius: BorderRadius.circular(1),
                    ),
                    transform: _menuOpen
                        ? (Matrix4.rotationZ(-0.785)..translate(0.0, -8.0))
                        : Matrix4.identity(),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _desktopNav() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: _navItems().map((item) {
        final isActive = _activeSection == item.$1;
        return GestureDetector(
          onTap: () => _scrollTo(item.$1),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text(
              item.$2,
              style: GoogleFonts.cinzel(
                color: isActive ? AppColors.chene : AppColors.acier,
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  List<(String, String)> _navItems() => [
    ('galerie', 'Galerie'),
    ('expertise', 'Expertise'),
    ('tarifs', 'Prix / Forfaits'),
    ('contact', 'Me contacter'),
  ];
}
