import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class TarifsSection extends StatelessWidget {
  const TarifsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;

    return Container(
      color: AppColors.fond,
      padding: EdgeInsets.symmetric(vertical: 70, horizontal: isMobile ? 20 : 60),
      child: Column(
        children: [
          Text(
            'Tarifs',
            style: GoogleFonts.cinzel(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: AppColors.texte,
              letterSpacing: 3,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Collecte & Livraison incluses (Lyon 1er, 2e, 3e, 4e)',
            textAlign: TextAlign.center,
            style: GoogleFonts.cinzel(
              color: AppColors.acier,
              fontSize: 12,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 40),

          // Menu style carte
          Container(
            constraints: const BoxConstraints(maxWidth: 560),
            decoration: BoxDecoration(
              border: Border.all(color: AppColors.chene.withOpacity(0.4), width: 1),
            ),
            padding: const EdgeInsets.all(32),
            child: Column(
              children: [
                Text(
                  'Affûtage de précision • Lyon 4',
                  style: GoogleFonts.cinzel(
                    color: AppColors.acier,
                    fontSize: 11,
                    letterSpacing: 2,
                  ),
                ),
                const SizedBox(height: 24),

                // Cuisine
                _menuSection('Cuisine', [
                  ('Petite Lame (< 10cm)', '7 €'),
                  ('Grande lame (> 15cm)', '10 €'),
                  ('Couteau Japonais', '14 €'),
                  ('Ciseaux de cuisine', '8 €'),
                ]),
                const SizedBox(height: 20),

                // Maison & Jardin
                _menuSection('Maison & Jardin', [
                  ('Ciseaux de couture', '12 €'),
                  ('Sécateur', '8 €'),
                  ('Hache / Hachoir', '13 €'),
                ]),

                const SizedBox(height: 20),
                Divider(color: AppColors.chene.withOpacity(0.3)),
                const SizedBox(height: 16),

                Text(
                  '💎 Réparations : Pointe cassée (+3 €) | Brèche importante (sur devis).',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.cinzel(
                    color: AppColors.acier,
                    fontSize: 11,
                    height: 1.7,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Travail réalisé sur meule Tormek T-8 pour une finition rasoir sans chauffe de l\'acier.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.cinzel(
                    color: AppColors.acier.withOpacity(0.7),
                    fontSize: 10,
                    height: 1.7,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 50),

          // Forfaits Pro
          Text(
            '🚲  Forfaits Professionnels (Annuel)',
            style: GoogleFonts.cinzel(
              color: AppColors.texte,
              fontSize: 18,
              fontWeight: FontWeight.bold,
              letterSpacing: 1,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 30),

          isMobile
              ? Column(children: _proCards())
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: _proCards().map((c) => Expanded(child: c)).toList(),
                ),

          const SizedBox(height: 30),

          // Forfait personnalisé
          Container(
            constraints: const BoxConstraints(maxWidth: 600),
            margin: const EdgeInsets.symmetric(horizontal: 20),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              border: Border.all(color: const Color(0xFFd4af37).withOpacity(0.5), width: 1),
              borderRadius: BorderRadius.circular(4),
              color: const Color(0xFFd4af37).withOpacity(0.04),
            ),
            child: Column(
              children: [
                Text(
                  'Forfait Personnalisé',
                  style: GoogleFonts.cinzel(
                    color: const Color(0xFFd4af37),
                    fontSize: 14,
                    letterSpacing: 2,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Chaque établissement est unique. Pour un volume spécifique (ex: 40 lames), contactez-moi pour un devis personnalisé ajusté à vos besoins réels.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.cinzel(
                    color: AppColors.acier,
                    fontSize: 12,
                    height: 1.6,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _menuSection(String title, List<(String, String)> rows) {
    return Column(
      children: [
        Text(
          title,
          style: GoogleFonts.cinzel(
            color: AppColors.chene,
            fontSize: 15,
            fontWeight: FontWeight.bold,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 12),
        ...rows.map((r) => Padding(
              padding: const EdgeInsets.symmetric(vertical: 5),
              child: Row(
                children: [
                  Text(r.$1, style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 13)),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: LayoutBuilder(
                        builder: (context, constraints) {
                          final dotsCount = (constraints.maxWidth / 8).floor();
                          return Text(
                            '.' * dotsCount,
                            style: GoogleFonts.cinzel(
                              color: AppColors.chene.withOpacity(0.3),
                              fontSize: 13,
                            ),
                            overflow: TextOverflow.clip,
                            maxLines: 1,
                          );
                        },
                      ),
                    ),
                  ),
                  Text(
                    r.$2,
                    style: GoogleFonts.cinzel(
                      color: AppColors.chene,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            )),
      ],
    );
  }

  List<Widget> _proCards() {
    return [
      _ProCard(
        title: 'Forfait Cuisine',
        price: '800€',
        features: const [
          '6 passages / an (Bimestriel)',
          "Jusqu'à 15 pièces / passage",
          'Spécial Petites Brigades',
          'Soit 8,88€ par lame',
        ],
        featured: false,
      ),
      _ProCard(
        title: 'Forfait Établissement',
        price: '2100€',
        features: const [
          '6 passages / an (Bimestriel)',
          "Jusqu'à 60 pièces / passage",
          'Cuisine, Table & Ciseaux',
          'Soit 5,83€ par lame',
        ],
        featured: true,
        badge: 'Recommandé',
      ),
      _ProCard(
        title: 'Forfait Campus',
        price: '3000€',
        features: const [
          '4 passages / an (Trimestriel)',
          "Jusqu'à 100 pièces / passage",
          'Cuisine Centrale & Mallettes Élèves',
          'Logistique 100% Vélo Cargo',
        ],
        featured: false,
        footnote: 'Écoles & Centres de formation : Possibilité d\'interventions ponctuelles avec paiement direct des étudiants (Tap to Pay).',
      ),
    ];
  }
}

class _ProCard extends StatelessWidget {
  final String title;
  final String price;
  final List<String> features;
  final bool featured;
  final String? badge;
  final String? footnote;

  const _ProCard({
    required this.title,
    required this.price,
    required this.features,
    required this.featured,
    this.badge,
    this.footnote,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(8),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.fondCard,
        border: Border.all(
          color: featured ? AppColors.chene : AppColors.acier.withOpacity(0.2),
          width: featured ? 1.5 : 1,
        ),
        borderRadius: BorderRadius.circular(4),
        boxShadow: featured
            ? [BoxShadow(color: AppColors.chene.withOpacity(0.15), blurRadius: 20, spreadRadius: 2)]
            : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (badge != null)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.chene,
                borderRadius: BorderRadius.circular(2),
              ),
              child: Text(
                badge!,
                style: GoogleFonts.cinzel(
                  color: AppColors.fond,
                  fontSize: 9,
                  letterSpacing: 1.5,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          Text(
            title,
            style: GoogleFonts.cinzel(
              color: AppColors.texte,
              fontSize: 14,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 12),
          RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: price,
                  style: GoogleFonts.cinzel(
                    color: AppColors.chene,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextSpan(
                  text: '/an',
                  style: GoogleFonts.cinzel(
                    color: AppColors.acier,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ...features.map((f) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('✓ ', style: GoogleFonts.cinzel(color: AppColors.chene, fontSize: 12)),
                    Expanded(
                      child: Text(
                        f,
                        style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 12, height: 1.5),
                      ),
                    ),
                  ],
                ),
              )),
          if (footnote != null) ...[
            const SizedBox(height: 12),
            Text(
              footnote!,
              style: GoogleFonts.cinzel(color: AppColors.acier, fontSize: 10, height: 1.5),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}
