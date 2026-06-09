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
  DollarSign 
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
      { Icon: DollarSign, color: colors.primary, style: { bottom: 10, left: 10 } }
    ]
  }
];

// Infinite loop cloning: Add last slide at the start, and first slide at the end
const LOOP_SLIDES = [
  SLIDES[SLIDES.length - 1], // Slide 2 clone at index 0
  ...SLIDES,                 // Real slides at index 1, 2, 3
  SLIDES[0]                  // Slide 0 clone at index 4
];

export default function Onboarding({ navigation }) {
  const { width } = useWindowDimensions();
  if (width === 0) return null;
  const [currentIndex, setCurrentIndex] = useState(0); // tracks real index (0, 1, 2)
  const scrollX = useRef(new Animated.Value(width > 0 ? width : 375)).current; // initial position on real slide 0
  const scrollViewRef = useRef(null);
  const timerRef = useRef(null);
  const isInitialScrollDone = useRef(false);
  const isDragging = useRef(false);

  const startAutoSlide = () => {
    stopAutoSlide();
    if (isDragging.current || width <= 0) return;
    
    timerRef.current = setInterval(() => {
      // Calculate the next index we want to scroll to in the LOOP_SLIDES list.
      // Since real index starts at 0 (rendered at index 1), the render position is currentIndex + 1.
      const nextRenderIndex = currentIndex + 2; 
      
      scrollViewRef.current?.scrollTo({
        x: nextRenderIndex * width,
        animated: true,
      });

      // Optimistically update the real index state to keep dots in sync during scroll
      const nextRealIndex = (currentIndex + 1) % SLIDES.length;
      setCurrentIndex(nextRealIndex);
    }, 2500);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Perform silent loop jump when scrolling reaches clones
  const handleScrollEnd = (xOffset) => {
    if (width <= 0) return;
    const totalContentWidth = LOOP_SLIDES.length * width;
    
    // 1. If we reached the left clone (Slide 2 clone at offset 0):
    if (xOffset <= 0.1 * width) {
      scrollViewRef.current?.scrollTo({ x: 3 * width, animated: false });
      setCurrentIndex(2);
      scrollX.setValue(3 * width);
    }
    // 2. If we reached the right clone (Slide 0 clone at offset 4 * width):
    else if (xOffset >= 3.9 * width) {
      scrollViewRef.current?.scrollTo({ x: width, animated: false });
      setCurrentIndex(0);
      scrollX.setValue(width);
    } 
    // 3. Normal positioning inside real slides:
    else {
      const realIndex = Math.round(xOffset / width) - 1;
      if (realIndex >= 0 && realIndex < SLIDES.length) {
        setCurrentIndex(realIndex);
      }
    }
  };

  useEffect(() => {
    if (width > 0 && !isInitialScrollDone.current) {
      // Scroll to the first real slide initially once dimensions are ready
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: width, animated: false });
        scrollX.setValue(width);
      }, 50);
      isInitialScrollDone.current = true;
    }
  }, [width]);

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [currentIndex, width]);

  const handleDotPress = (index) => {
    stopAutoSlide();
    const renderIndex = index + 1;
    scrollViewRef.current?.scrollTo({
      x: renderIndex * width,
      animated: true,
    });
    setCurrentIndex(index);
    startAutoSlide();
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
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: width, y: 0 }}
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
        {LOOP_SLIDES.map((slide, index) => {
          const { CenterIcon, centerColor, floatingIcons } = slide;
          // Assign a unique key incorporating the render index to avoid key collisions
          return (
            <View key={`${slide.id}-${index}`} style={[styles.slideWidth, { width }]}>
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
            // Since there is a clone at start, the active slide position is shifted by exactly +width.
            // Active offset for dot at 'index' is (index + 1) * width.
            const dotPosition = (index + 1) * width;
            
            const dotWidth = scrollX.interpolate({
              inputRange: [
                dotPosition - width,
                dotPosition,
                dotPosition + width
              ],
              outputRange: [10, 28, 10],
              extrapolate: 'clamp'
            });

            const dotColor = scrollX.interpolate({
              inputRange: [
                dotPosition - width,
                dotPosition,
                dotPosition + width
              ],
              outputRange: [colors.border, colors.primary, colors.border],
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
