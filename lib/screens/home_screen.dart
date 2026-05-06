import 'package:flutter/material.dart';
import '../widgets/nav_bar.dart';
import '../widgets/hero_section.dart';
import '../widgets/gallery_section.dart';
import '../widgets/expertise_section.dart';
import '../widgets/tarifs_section.dart';
import '../widgets/contact_section.dart';
import '../widgets/footer_widget.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _scrollController = ScrollController();

  final _sectionKeys = {
    'galerie': GlobalKey(),
    'expertise': GlobalKey(),
    'tarifs': GlobalKey(),
    'contact': GlobalKey(),
  };

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          SingleChildScrollView(
            controller: _scrollController,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                HeroSection(scrollController: _scrollController),
                Container(key: _sectionKeys['galerie'], child: const GallerySection()),
                Container(key: _sectionKeys['expertise'], child: const ExpertiseSection()),
                Container(key: _sectionKeys['tarifs'], child: const TarifsSection()),
                Container(key: _sectionKeys['contact'], child: const ContactSection()),
                const FooterWidget(),
              ],
            ),
          ),
          NavBar(
            scrollController: _scrollController,
            sectionKeys: _sectionKeys,
          ),
        ],
      ),
    );
  }
}
