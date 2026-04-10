import React, { useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { useLanguage } from '../i18n/LanguageContext';
import { TranslationKey } from '../i18n/translations';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const REPO_LINKS = {
  github:   'https://github.com/neweradev17/LocalMeteorology.git',
  codeberg: 'https://codeberg.org/neweradev17/LocalMeteorology.git',
};

const Icon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 20,
  color = '#FFAA00',
}) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8 };
  switch (name) {
    case 'eye-off':
      return (
        <Svg {...props}>
          <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <Line x1="1" y1="1" x2="23" y2="23" />
        </Svg>
      );
    case 'database':
      return (
        <Svg {...props}>
          <Rect x="2" y="3" width="20" height="6" rx="3" />
          <Path d="M2 9v6c0 1.66 4.48 3 10 3s10-1.34 10-3V9" />
          <Path d="M2 15v6c0 1.66 4.48 3 10 3s10-1.34 10-3v-6" />
        </Svg>
      );
    case 'wifi':
      return (
        <Svg {...props}>
          <Path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <Path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <Circle cx="12" cy="20" r="1" fill={color} />
        </Svg>
      );
    case 'server':
      return (
        <Svg {...props}>
          <Rect x="2" y="2" width="20" height="8" rx="2" />
          <Rect x="2" y="14" width="20" height="8" rx="2" />
          <Line x1="6" y1="6" x2="6.01" y2="6" />
          <Line x1="6" y1="18" x2="6.01" y2="18" />
        </Svg>
      );
    case 'shield':
      return (
        <Svg {...props}>
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <Polyline points="9 12 11 14 15 10" />
        </Svg>
      );
    case 'x':
      return (
        <Svg {...props}>
          <Line x1="18" y1="6" x2="6" y2="18" />
          <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
      );
    default:
      return null;
  }
};

const SECTIONS: { icon: string; headingKey: TranslationKey; bodyKey: TranslationKey }[] = [
  { icon: 'eye-off',  headingKey: 'privacy_no_tracking_heading',    bodyKey: 'privacy_no_tracking_body' },
  { icon: 'database', headingKey: 'privacy_local_storage_heading',  bodyKey: 'privacy_local_storage_body' },
  { icon: 'wifi',     headingKey: 'privacy_network_heading',        bodyKey: 'privacy_network_body' },
  { icon: 'server',   headingKey: 'privacy_no_backend_heading',     bodyKey: 'privacy_no_backend_body' },
  { icon: 'shield',   headingKey: 'privacy_third_party_heading',    bodyKey: 'privacy_third_party_body' },
];

const SWIPE_DOWN_THRESHOLD = 40;
const DISMISS_SCROLL_THRESHOLD = -30;

const PrivacyModal: React.FC<Props> = ({ visible, onClose }) => {
  const { t } = useLanguage();

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const scrollY      = useRef(0);
  const isDismissing = useRef(false);

  const handlePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dy >= SWIPE_DOWN_THRESHOLD && !isDismissing.current) {
          isDismissing.current = true;
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            damping: 22,
            stiffness: 180,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      isDismissing.current = false;
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
  };

  const handleScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY < DISMISS_SCROLL_THRESHOLD && !isDismissing.current) {
      isDismissing.current = true;
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

          <View
            {...handlePanResponder.panHandlers}
            style={styles.handleContainer}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 16, bottom: 16, left: 80, right: 80 }}
            >
              <View style={styles.handle} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Icon name="shield" size={22} color="#FFAA00" />
              <Text style={styles.title}>{t('privacy_title')}</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>{t('privacy_subtitle')}</Text>

          <View style={styles.headerDivider} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={16}
          >
            {SECTIONS.map((section, index) => (
              <View key={index} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconBadge}>
                    <Icon name={section.icon} size={16} color="#FFAA00" />
                  </View>
                  <Text style={styles.sectionHeading}>{t(section.headingKey)}</Text>
                </View>
                <Text style={styles.sectionBody}>{t(section.bodyKey)}</Text>
                {index < SECTIONS.length - 1 && (
                  <View style={styles.sectionDivider} />
                )}
              </View>
            ))}

            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('privacy_footer')}</Text>
              <View style={styles.footerLinks}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(REPO_LINKS.github)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>GitHub</Text>
                </TouchableOpacity>
                <Text style={styles.footerLinkSeparator}>·</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(REPO_LINKS.codeberg)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Codeberg</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

export default PrivacyModal;

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.88,
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
  safeArea: {
    flex: 1,
    overflow: 'hidden',
  },
  handleContainer: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginTop: 2,
    marginBottom: 0,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fcc558',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 14,
    opacity: 0.85,
    letterSpacing: 0.1,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#FFAA00',
    marginHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFAA00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFAA00',
    letterSpacing: 0.2,
  },
  sectionBody: {
    fontSize: 13.5,
    color: '#ffffff',
    lineHeight: 21,
    paddingLeft: 42,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#fcc558',
    marginVertical: 16,
    marginLeft: 42,
  },
  footer: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.07)',
    borderWidth: 1,
    borderColor: '#FFAA00',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12.5,
    color: '#fcc558',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    fontSize: 12.5,
    color: '#FFAA00',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },
  footerLinkSeparator: {
    fontSize: 12.5,
    color: '#FFAA00',
    opacity: 0.4,
  },
});