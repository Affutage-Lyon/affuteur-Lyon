import 'package:flutter/material.dart';

class KnifePainter extends CustomPainter {
  final double repairProgress;

  const KnifePainter(this.repairProgress);

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    final scaleX = size.width / 200;
    final scaleY = size.height / 650;
    canvas.scale(scaleX, scaleY);

    _drawHandle(canvas);
    _drawGuard(canvas);
    _drawBlade(canvas, repairProgress);

    canvas.restore();
  }

  void _drawHandle(Canvas canvas) {
    final paint = Paint()
      ..color = const Color(0xFFFFF1D3)
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(85, 30);
    path.cubicTo(85, 30, 75, 40, 75, 70);
    path.lineTo(75, 240);
    path.cubicTo(75, 270, 85, 280, 85, 280);
    path.lineTo(115, 280);
    path.cubicTo(115, 280, 125, 270, 125, 240);
    path.lineTo(125, 70);
    path.cubicTo(125, 40, 115, 30, 115, 30);
    path.close();
    canvas.drawPath(path, paint);

    final rivetPaint = Paint()
      ..color = const Color(0xFF8e9aaf)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(const Offset(100, 80), 3.5, rivetPaint);
    canvas.drawCircle(const Offset(100, 155), 3.5, rivetPaint);
    canvas.drawCircle(const Offset(100, 230), 3.5, rivetPaint);
  }

  void _drawGuard(Canvas canvas) {
    final paint = Paint()
      ..color = const Color(0xFFF2EAE0)
      ..style = PaintingStyle.fill;
    final rRect = RRect.fromRectAndRadius(
      const Rect.fromLTWH(72, 280, 56, 15),
      const Radius.circular(2),
    );
    canvas.drawRRect(rRect, paint);
  }

  void _drawBlade(Canvas canvas, double t) {
    final bladeColor = Color.lerp(
      const Color(0xFF555c69),
      Colors.white,
      t,
    )!;

    final bladePaint = Paint()
      ..color = bladeColor
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(85, 295);
    path.lineTo(85, 610);

    if (t < 0.5) {
      path.lineTo(115, 610);
      path.lineTo(165, 295);
    } else {
      path.cubicTo(85, 610, 100, 630, 165, 295);
    }

    path.close();
    canvas.drawPath(path, bladePaint);

    if (t > 0.5) {
      final glowPaint = Paint()
        ..color = Colors.white.withOpacity(0.15 * ((t - 0.5) * 2).clamp(0.0, 1.0))
        ..style = PaintingStyle.fill
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 8);
      canvas.drawPath(path, glowPaint);
    }
  }

  @override
  bool shouldRepaint(KnifePainter old) => old.repairProgress != repairProgress;
}
