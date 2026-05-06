import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme.dart';

class ExpertiseSection extends StatefulWidget {
  const ExpertiseSection({super.key});

  @override
  State<ExpertiseSection> createState() => _ExpertiseSectionState();
}

class _ExpertiseSectionState extends State<ExpertiseSection> {
  int _openIndex = -1;

  static const _items = [
    _FaqItem(
      question: '01. Quel est le gain économique pour mon établissement ?',
      answer:
          "L'entretien régulier sur Tormek T-8 prolonge la durée de vie de vos couteaux de 3 à 5 ans. En évitant le rachat prématuré de matériel professionnel, vous réduisez votre budget d'équipement annuel de 20% dès la première année.",
    ),
    _FaqItem(
      question: '02. Comment garantissez-vous la sécurité de ma brigade ?',
      answer:
          "Un couteau émoussé est la première cause d'accidents en cuisine collective. Nos contrats assurent un tranchant «rasoir» constant, garantissant un geste précis et une conformité aux normes HACCP.",
    ),
    _FaqItem(
      question: '03. Pourquoi choisir le service en vélo cargo à Lyon ?',
      answer:
          "En plus de la flexibilité, ce service s'inscrit dans votre démarche RSE. Nous intervenons sans émission de CO2, valorisant l'engagement environnemental de votre établissement.",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;

    return Container(
      color: const Color(0xFF1e2226),
      padding: EdgeInsets.symmetric(vertical: 70, horizontal: isMobile ? 20 : 80),
      child: Column(
        children: [
          _SectionTitle(title: 'Expertise & Rentabilité'),
          const SizedBox(height: 40),
          ...List.generate(_items.length, (i) {
            final isOpen = _openIndex == i;
            return Column(
              children: [
                GestureDetector(
                  onTap: () => setState(() => _openIndex = isOpen ? -1 : i),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 0),
                    decoration: BoxDecoration(
                      border: Border(
                        bottom: BorderSide(
                          color: AppColors.acier.withOpacity(0.2),
                          width: 1,
                        ),
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            _items[i].question,
                            style: GoogleFonts.cinzel(
                              color: isOpen ? AppColors.chene : AppColors.texte,
                              fontSize: 13,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                        AnimatedRotation(
                          turns: isOpen ? 0.5 : 0,
                          duration: const Duration(milliseconds: 300),
                          child: Icon(
                            Icons.keyboard_arrow_down,
                            color: AppColors.chene,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                AnimatedCrossFade(
                  duration: const Duration(milliseconds: 300),
                  crossFadeState: isOpen ? CrossFadeState.showSecond : CrossFadeState.showFirst,
                  firstChild: const SizedBox.shrink(),
                  secondChild: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 0),
                    child: Text(
                      _items[i].answer,
                      style: GoogleFonts.cinzel(
                        color: AppColors.acier,
                        fontSize: 13,
                        height: 1.8,
                      ),
                    ),
                  ),
                ),
              ],
            );
          }),
        ],
      ),
    );
  }
}

class _FaqItem {
  final String question;
  final String answer;

  const _FaqItem({required this.question, required this.answer});
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      textAlign: TextAlign.center,
      style: GoogleFonts.cinzel(
        fontSize: 26,
        fontWeight: FontWeight.bold,
        color: AppColors.texte,
        letterSpacing: 3,
      ),
    );
  }
}
