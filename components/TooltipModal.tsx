import React, { useRef, useEffect } from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Animated, Dimensions, PanResponder,
  NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Line, Polyline, Rect } from 'react-native-svg';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_DOWN_THRESHOLD = 40;
const DISMISS_SCROLL_THRESHOLD = -30;

const GOLD = '#FFAA00';

// Cores idênticas ao CurrentWeather
const IconArrowUp = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="19" x2="12" y2="5" stroke="#ff0000" strokeWidth={2.5} strokeLinecap="round" />
    <Polyline points="5 12 12 5 19 12" stroke="#ff0000" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconArrowDown = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="5" x2="12" y2="19" stroke="#0099ff" strokeWidth={2.5} strokeLinecap="round" />
    <Polyline points="19 12 12 19 5 12" stroke="#0099ff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconDroplet = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      stroke="#0099ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const IconWind = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M9.59 4.59A2 2 0 1 1 11 8H2" stroke="#FFAA00" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12.59 19.41A2 2 0 1 0 14 16H2" stroke="#FFAA00" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6.59 11.41A2 2 0 1 0 8 8H2" stroke="#FFAA00" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TooltipModal: React.FC<Props> = ({ visible, onClose }) => {
  const { t } = useLanguage();

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDismissing = useRef(false);

  const handlePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 0) slideAnim.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dy >= SWIPE_DOWN_THRESHOLD && !isDismissing.current) {
          isDismissing.current = true;
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0, damping: 22, stiffness: 180, useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      isDismissing.current = false;
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, damping: 22, stiffness: 180, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 220, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY < DISMISS_SCROLL_THRESHOLD && !isDismissing.current) {
      isDismissing.current = true;
      onClose();
    }
  };

  const items: { icon: React.ReactNode; label: string }[] = [
    { icon: <IconArrowUp />,   label: t('tooltip_max_temp') },
    { icon: <IconArrowDown />, label: t('tooltip_min_temp') },
    { icon: <IconDroplet />,   label: t('tooltip_humidity') },
    { icon: <IconWind />,      label: t('tooltip_wind') },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

          <View {...handlePanResponder.panHandlers} style={styles.handleContainer}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} hitSlop={{ top: 16, bottom: 16, left: 80, right: 80 }}>
              <View style={styles.handle} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
  <View style={styles.headerLeft}>
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.8}>
      <Rect x="3" y="4" width="4" height="4" rx="1" fill={GOLD} stroke="none" />
      <Line x1="10" y1="6" x2="21" y2="6" stroke={GOLD} strokeLinecap="round" />
      <Rect x="3" y="10" width="4" height="4" rx="1" fill={GOLD} stroke="none" />
      <Line x1="10" y1="12" x2="21" y2="12" stroke={GOLD} strokeLinecap="round" />
      <Rect x="3" y="16" width="4" height="4" rx="1" fill={GOLD} stroke="none" />
      <Line x1="10" y1="18" x2="21" y2="18" stroke={GOLD} strokeLinecap="round" />
    </Svg>
    <Text style={styles.title}>{t('tooltip_title')}</Text>
  </View>
</View>

          <View style={styles.headerDivider} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={16}
          >
            {items.map((item, index) => (
              <View key={index}>
                <View style={styles.row}>
                  <View style={styles.iconBadge}>{item.icon}</View>
                  <Text style={styles.label}>{item.label}</Text>
                </View>
                {index < items.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </ScrollView>

        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

export default TooltipModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: SCREEN_HEIGHT * 0.42,
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#fcc558',
    shadowColor: '#FFAA00',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 30,
  },
  safeArea: { flex: 1, overflow: 'hidden' },
  handleContainer: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginTop: 2,
  },
  handle: {
    width: 36, height: 4,
    borderRadius: 2,
    backgroundColor: '#FFAA00',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 18, fontWeight: '700', color: '#ffffff', letterSpacing: 0.3 },

  headerDivider: { height: 1, backgroundColor: '#FFAA00', marginHorizontal: 20, marginTop: 10 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  iconBadge: {
    backgroundColor: '#000000',
    borderColor: '#FFAA00',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontSize: 14, color: '#e0e0e0', letterSpacing: 0.15, lineHeight: 20 },
  separator: { height: 1, backgroundColor: '#fcc558', marginLeft: 50 },
});