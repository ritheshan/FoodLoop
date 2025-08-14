import 'package:flutter/material.dart';
import 'dart:math';

import 'package:foodloop_mobile/core/theme/app_pallete.dart';

class FancyFoodLoader extends StatefulWidget {
  const FancyFoodLoader({Key? key}) : super(key: key);

  @override
  _FancyFoodLoaderState createState() => _FancyFoodLoaderState();
}

class _FancyFoodLoaderState extends State<FancyFoodLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<String> foodEmojis = [
    '🍕', '🍔', '🍟', '🍣', '🍩', '🍜', '🍦', '🍰', '🍎', 
    '🍒', '🍓', '🥑', '🌮', '🌯', '🍗', '🥩', '🥪', '🍪',
    '🥗', '🍱', '🍚', '🥤', '🍇', '🍉'
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds:5),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 100,
                height: 100,
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation(AppPallete.gradient1),
                  strokeWidth: 6,
                ),
              ),
              Transform.rotate(
                angle: _controller.value * 2 * pi,
                child: Text(
                  foodEmojis[(_controller.value * foodEmojis.length).floor() % foodEmojis.length],
                  style: const TextStyle(fontSize: 60),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

