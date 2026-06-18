import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { 
  Search, 
  ShieldCheck, 
  Wrench, 
  Award, 
  Sparkles, 
  CreditCard, 
  CheckCircle, 
  IndianRupee 
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../utils/colors';

const SLIDES = [
  {
    id: 0,
    title: "Find Skilled Workers Instantly",
    subtitle: "Connect with verified plumbers, electricians, carpenters, and more in your local area.",
    CenterIcon: Search,
    centerColor: colors.primary,
    floatingIcons: [
      { Icon: ShieldCheck, color: colors.success, style: { top: 10, right: 10 } },
      { Icon: Wrench, color: colors.accent, style: { bottom: 20, left: 0 } }
    ]
  },
  {
    id: 1,
    title: "100% Verified Professionals",
    subtitle: "Every service provider is background checked and verified for your safety and trust.",
    CenterIcon: ShieldCheck,
    centerColor: colors.success,
    floatingIcons: [
      { Icon: Award, color: colors.warning, style: { top: 15, left: 15 } },
      { Icon: Sparkles, color: colors.accent, style: { bottom: 15, right: 10 } }
    ]
  },
  {
    id: 2,
    title: "Secure & Easy Payments",
    subtitle: "Upfront pricing with no hidden charges. Pay securely directly through the app.",
    CenterIcon: CreditCard,
    centerColor: colors.accent,
    floatingIcons: [
      { Icon: CheckCircle, color: colors.success, style: { top: 10, right: 15 } },
      { Icon: IndianRupee, color: colors.primary, style: { bottom: 10, left: 10 } }
    ]
  }
];

export default function Onboarding({ navigation }) {
  const { width } = useWindowDimensions();
  if (width === 0) return null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const timerRef = useRef(null);
  const isDragging = useRef(false);
  const isInitialized = useRef(false);

  const virtualSlides = [
    SLIDES[SLIDES.length - 1],
    ...SLIDES,
    SLIDES[0]
  ];

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const startAutoSlide = () => {
    stopAutoSlide();
    if (isDragging.current || width <= 0) return;
    
    timerRef.current = setInterval(() => {
      const nextVirtualIndex = currentIndexRef.current + 2;
      scrollViewRef.current?.scrollTo({
        x: nextVirtualIndex * width,
        animated: true,
      });
    }, 2500);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleScrollEnd = (xOffset) => {
    if (width <= 0) return;
    const virtualIndex = Math.round(xOffset / width);
    
    if (virtualIndex === 0) {
      scrollViewRef.current?.scrollTo({
        x: SLIDES.length * width,
        animated: false,
      });
      setCurrentIndex(SLIDES.length - 1);
    } else if (virtualIndex === SLIDES.length + 1) {
      scrollViewRef.current?.scrollTo({
        x: width,
        animated: false,
      });
      setCurrentIndex(0);
    } else {
      setCurrentIndex(virtualIndex - 1);
    }
  };

  useEffect(() => {
    if (width > 0) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndexRef.current + 1) * width,
        animated: false,
      });
      isInitialized.current = true;
    }
  }, [width]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [currentIndex, width]);

  const handleDotPress = (index) => {
    stopAutoSlide();
    scrollViewRef.current?.scrollTo({
      x: (index + 1) * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event) => {
    handleScrollEnd(event.nativeEvent.contentOffset.x);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        contentOffset={{ x: width, y: 0 }}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScrollBeginDrag={() => {
          isDragging.current = true;
          stopAutoSlide();
        }}
        onScrollEndDrag={() => {
          isDragging.current = false;
          startAutoSlide();
        }}
        contentContainerStyle={styles.scrollContent}
      >
        {virtualSlides.map((slide, idx) => {
          const { CenterIcon, centerColor, floatingIcons } = slide;
          return (
            <View key={`${slide.id}-${idx}`} style={[styles.slideWidth, { width }]}>
              <View style={styles.slideContent}>
                {/* Dynamic Illustration Container */}
                <View style={styles.illustrationContainer}>
                  {floatingIcons.map((item, idx) => (
                    <View key={idx} style={[styles.floatingIcon, item.style]}>
                      <item.Icon color={item.color} size={24} />
                    </View>
                  ))}
                  <View style={styles.centerIcon}>
                    <CenterIcon color={centerColor} size={48} />
                  </View>
                </View>

                {/* Slide Title */}
                <Text style={styles.title}>{slide.title}</Text>
                
                {/* Slide Subtitle */}
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Dynamic Animated Pagination Dots */}
      <View style={styles.dotsWrapper}>
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => {
            const inputRange = [];
            const outputRangeWidth = [];
            const outputRangeColor = [];
            for (let j = 0; j < SLIDES.length + 2; j++) {
              inputRange.push(j * width);
              const slideIndex = (j - 1 + SLIDES.length) % SLIDES.length;
              if (slideIndex === index) {
                outputRangeWidth.push(28);
                outputRangeColor.push(colors.primary);
              } else {
                outputRangeWidth.push(10);
                outputRangeColor.push(colors.border);
              }
            }

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: outputRangeWidth,
              extrapolate: 'clamp'
            });

            const dotColor = scrollX.interpolate({
              inputRange,
              outputRange: outputRangeColor,
              extrapolate: 'clamp'
            });

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => handleDotPress(index)}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      backgroundColor: dotColor
                    }
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.9}
        onPress={() => {
          stopAutoSlide();
          navigation.navigate('OTPLogin');
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  slideWidth: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  illustrationContainer: {
    width: 170,
    height: 170,
    backgroundColor: colors.primaryLight,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  floatingIcon: {
    position: 'absolute',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  centerIcon: {
    backgroundColor: colors.surface,
    padding: 22,
    borderRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  dotsWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 10,
    padding: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 20,
    marginHorizontal: 24,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
