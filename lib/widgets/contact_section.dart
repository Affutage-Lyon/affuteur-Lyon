import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import '../theme.dart';

class ContactSection extends StatefulWidget {
  const ContactSection({super.key});

  @override
  State<ContactSection> createState() => _ContactSectionState();
}

class _ContactSectionState extends State<ContactSection> {
  final _formKey = GlobalKey<FormState>();
  String? _clientType;
  final _nameCtrl = TextEditingController();
  final _adresseCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _messageCtrl = TextEditingController();
  DateTime? _selectedDate;
  DateTime _calendarMonth = DateTime.now();
  bool _sending = false;
  String? _feedbackMsg;

  static const _months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  static const _weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  @override
  void dispose() {
    _nameCtrl.dispose();
    _adresseCtrl.dispose();
    _emailCtrl.dispose();
    _messageCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_clientType == null) {
      _showFeedback('Veuillez sélectionner votre profil.');
      return;
    }

    setState(() {
      _sending = true;
      _feedbackMsg = null;
    });

    try {
      final resp = await http.post(
        Uri.parse('https://formspree.io/f/xvzvjqve'),
        headers: {'Accept': 'application/json'},
        body: {
          '_subject': 'Nouvelle demande Ken Aiguise',
          'type_client': _clientType!,
          'name': _nameCtrl.text,
          'adresse_lieu': _adresseCtrl.text,
          '_replyto': _emailCtrl.text,
          'date_souhaitee': _selectedDate != null
              ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
              : 'Non précisée',
          'message': _messageCtrl.text,
        },
      );

      if (resp.statusCode == 200 || resp.statusCode == 201) {
        _showFeedback('Message envoyé avec succès !', success: true);
        _formKey.currentState!.reset();
        setState(() {
          _clientType = null;
          _selectedDate = null;
        });
      } else {
        _showFeedback('Erreur lors de l\'envoi. Veuillez réessayer.');
      }
    } catch (e) {
      _showFeedback('Erreur réseau. Veuillez réessayer.');
    }

    setState(() => _sending = false);
  }

  void _showFeedback(String msg, {bool success = false}) {
    setState(() => _feedbackMsg = msg);
  }

  List<DateTime?> _buildCalendarDays() {
    final firstDay = DateTime(_calendarMonth.year, _calendarMonth.month, 1);
    final lastDay = DateTime(_calendarMonth.year, _calendarMonth.month + 1, 0);
    final startWeekday = firstDay.weekday; // 1=Mon, 7=Sun
    final days = <DateTime?>[];

    for (int i = 1; i < startWeekday; i++) days.add(null);
    for (int d = 1; d <= lastDay.day; d++) {
      days.add(DateTime(_calendarMonth.year, _calendarMonth.month, d));
    }
    return days;
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 768;

    return Container(
      color: const Color(0xFF1e2226),
      padding: EdgeInsets.symmetric(vertical: 70, horizontal: isMobile ? 20 : 80),
      child: Column(
        children: [
          Text(
            'Contact & Rendez-vous',
            style: GoogleFonts.cinzel(
              fontSize: 26,
              fontWeight: FontWeight.bold,
              color: AppColors.texte,
              letterSpacing: 3,
            ),
          ),
          const SizedBox(height: 40),
          Container(
            constraints: const BoxConstraints(maxWidth: 600),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Type client
                  _fieldLabel('Vous êtes :'),
                  const SizedBox(height: 6),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.acier.withOpacity(0.3)),
                      borderRadius: BorderRadius.circular(2),
                      color: const Color(0xFF2a2d30),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: DropdownButton<String>(
                      value: _clientType,
                      dropdownColor: const Color(0xFF2a2d30),
                      isExpanded: true,
                      underline: const SizedBox.shrink(),
                      hint: Text(
                        'Sélectionnez votre profil',
                        style: GoogleFonts.cinzel(color: AppColors.acier, fontSize: 12),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'Professionnel', child: Text('Professionnel (Collège, Lycée, EHPAD)')),
                        DropdownMenuItem(value: 'Particulier', child: Text('Particulier')),
                      ],
                      onChanged: (v) => setState(() => _clientType = v),
                      style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 12),
                    ),
                  ),
                  const SizedBox(height: 16),

                  _buildField('Nom / Établissement', _nameCtrl, required: true),
                  const SizedBox(height: 16),
                  _buildField("Adresse d'intervention (Lyon/Métropole)", _adresseCtrl, required: true),
                  const SizedBox(height: 16),
                  _buildField('votre@email.com', _emailCtrl, required: true, email: true),
                  const SizedBox(height: 24),

                  // Calendrier
                  _fieldLabel('Date d\'intervention souhaitée :'),
                  const SizedBox(height: 12),
                  _buildCalendar(),
                  if (_selectedDate != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: Text(
                        'Date sélectionnée : ${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}',
                        style: GoogleFonts.cinzel(color: AppColors.chene, fontSize: 12),
                      ),
                    ),
                  const SizedBox(height: 20),

                  // Message
                  TextFormField(
                    controller: _messageCtrl,
                    maxLines: 5,
                    style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 12),
                    decoration: _inputDecoration('Votre besoin (nombre de couteaux...)'),
                    validator: (v) => (v == null || v.isEmpty) ? 'Champ requis' : null,
                  ),
                  const SizedBox(height: 24),

                  if (_feedbackMsg != null)
                    Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.chene.withOpacity(0.4)),
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: Text(
                        _feedbackMsg!,
                        style: GoogleFonts.cinzel(color: AppColors.chene, fontSize: 12),
                        textAlign: TextAlign.center,
                      ),
                    ),

                  ElevatedButton(
                    onPressed: _sending ? null : _submit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.chene,
                      foregroundColor: AppColors.fond,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
                    ),
                    child: _sending
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.fond),
                          )
                        : Text(
                            'ENVOYER LA DEMANDE',
                            style: GoogleFonts.cinzel(
                              fontSize: 12,
                              letterSpacing: 2,
                              fontWeight: FontWeight.bold,
                            ),
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

  Widget _buildField(String hint, TextEditingController ctrl, {bool required = false, bool email = false}) {
    return TextFormField(
      controller: ctrl,
      keyboardType: email ? TextInputType.emailAddress : TextInputType.text,
      style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 12),
      decoration: _inputDecoration(hint),
      validator: (v) {
        if (required && (v == null || v.isEmpty)) return 'Champ requis';
        if (email && v != null && !v.contains('@')) return 'Email invalide';
        return null;
      },
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.cinzel(color: AppColors.acier, fontSize: 12),
      filled: true,
      fillColor: const Color(0xFF2a2d30),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(color: AppColors.acier.withOpacity(0.3)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: BorderSide(color: AppColors.acier.withOpacity(0.3)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: const BorderSide(color: AppColors.chene),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(2),
        borderSide: const BorderSide(color: Colors.redAccent),
      ),
    );
  }

  Widget _fieldLabel(String text) {
    return Text(
      text,
      style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 12, letterSpacing: 0.5),
    );
  }

  Widget _buildCalendar() {
    final days = _buildCalendarDays();
    final today = DateTime.now();

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF2a2d30),
        border: Border.all(color: AppColors.acier.withOpacity(0.3)),
        borderRadius: BorderRadius.circular(2),
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          // Header mois
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: () => setState(() {
                  _calendarMonth = DateTime(_calendarMonth.year, _calendarMonth.month - 1);
                }),
                icon: const Icon(Icons.chevron_left, color: AppColors.chene),
                iconSize: 18,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
              Text(
                '${_months[_calendarMonth.month - 1]} ${_calendarMonth.year}',
                style: GoogleFonts.cinzel(color: AppColors.texte, fontSize: 13, letterSpacing: 1),
              ),
              IconButton(
                onPressed: () => setState(() {
                  _calendarMonth = DateTime(_calendarMonth.year, _calendarMonth.month + 1);
                }),
                icon: const Icon(Icons.chevron_right, color: AppColors.chene),
                iconSize: 18,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Jours de la semaine
          Row(
            children: _weekdays.map((d) => Expanded(
              child: Text(
                d,
                textAlign: TextAlign.center,
                style: GoogleFonts.cinzel(
                  color: AppColors.acier,
                  fontSize: 9,
                  letterSpacing: 0.5,
                ),
              ),
            )).toList(),
          ),
          const SizedBox(height: 4),

          // Grille de jours
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 2,
              crossAxisSpacing: 2,
              childAspectRatio: 1,
            ),
            itemCount: days.length,
            itemBuilder: (context, i) {
              final day = days[i];
              if (day == null) return const SizedBox.shrink();

              final isPast = day.isBefore(DateTime(today.year, today.month, today.day));
              final isSelected = _selectedDate != null &&
                  day.year == _selectedDate!.year &&
                  day.month == _selectedDate!.month &&
                  day.day == _selectedDate!.day;

              return GestureDetector(
                onTap: isPast ? null : () => setState(() => _selectedDate = day),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.chene
                        : isPast
                            ? Colors.transparent
                            : Colors.transparent,
                    borderRadius: BorderRadius.circular(2),
                    border: isSelected
                        ? null
                        : Border.all(
                            color: isPast
                                ? Colors.transparent
                                : AppColors.acier.withOpacity(0.1),
                          ),
                  ),
                  child: Center(
                    child: Text(
                      '${day.day}',
                      style: GoogleFonts.cinzel(
                        fontSize: 10,
                        color: isSelected
                            ? AppColors.fond
                            : isPast
                                ? AppColors.acier.withOpacity(0.3)
                                : AppColors.texte,
                        decoration: isPast ? TextDecoration.lineThrough : null,
                        decorationColor: AppColors.acier.withOpacity(0.3),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
