import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, FlatList,
  Text, StyleSheet, Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { NominatimResult } from '../types/weather';
import { searchPlaces, formatPlaceName } from '../utils/nominatim';
import { useLanguage } from '../i18n/LanguageContext';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import PrivacyModal from './PrivacyModal';
import TooltipModal from './TooltipModal';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSelectResult: (result: NominatimResult) => void;
  onLanguagePress: () => void;
  onMenuOpen?: (open: boolean) => void;
  onModalOpen?: (open: boolean) => void;
}

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  onSelectResult,
  onLanguagePress,
  onMenuOpen,
  onModalOpen,
}) => {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async () => {
    const query = value.trim();
    if (query.length < 2) return;
    Keyboard.dismiss();
    setShowMenu(false);
    onMenuOpen?.(false);
    setLoading(true);
    try {
      const data = await searchPlaces(query);
      setResults(data);
      setShowDropdown(data.length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: NominatimResult) => {
    Keyboard.dismiss();
    setShowDropdown(false);
    setResults([]);
    setFocused(false);
    setShowMenu(false);
    onMenuOpen?.(false);
    onSelectResult(result);
  };

  const handleClear = () => {
    onChangeText('');
    setResults([]);
    setShowDropdown(false);
  };

  const handleMenuToggle = () => {
    Keyboard.dismiss();
    setShowDropdown(false);
    const next = !showMenu;
    setShowMenu(next);
    onMenuOpen?.(next);
  };

  const handleLanguageOption = () => {
    setShowMenu(false);
    onMenuOpen?.(false);
    onLanguagePress();
  };

  const handlePrivacyOption = () => {
    setShowMenu(false);
    onMenuOpen?.(false);
    setShowPrivacy(true);
    onModalOpen?.(true); 
  };

  const handleTooltipOption = () => {
    setShowMenu(false);
    onMenuOpen?.(false);
    setShowTooltip(true);
    onModalOpen?.(true); 
  };

  const handlePrivacyClose = () => {
    setShowPrivacy(false);
    onModalOpen?.(false); 
  };

  const handleTooltipClose = () => {
    setShowTooltip(false);
    onModalOpen?.(false); 
  };

  return (
    <TouchableWithoutFeedback onPress={() => { setShowMenu(false); onMenuOpen?.(false); }}>
      <View style={styles.wrapper}>
        <View style={styles.row}>
          <View style={[styles.card, focused && styles.cardFocused]}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={t('search_placeholder')}
                placeholderTextColor="#E7E9EA"
                selectionColor="#FFAA00"
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="words"
                onFocus={() => { setFocused(true); setShowMenu(false); onMenuOpen?.(false); }}
                onBlur={() => setFocused(false)}
                onSubmitEditing={handleSubmit}
              />

              {value.length > 0 && (
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View style={styles.clearCircle}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {showDropdown && (
              <View style={styles.dropdown}>
                <View style={styles.divider} />
                <FlatList
                  data={results}
                  keyExtractor={(item) => String(item.place_id)}
                  keyboardShouldPersistTaps="handled"
                  scrollEnabled={true}
                  style={{ maxHeight: 260 }}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  renderItem={({ item }) => {
                    const name = formatPlaceName(item);
                    const flag = item.address.country_code
                      ? countryFlag(item.address.country_code)
                      : '📍';
                    return (
                      <TouchableOpacity
                        style={styles.resultItem}
                        onPress={() => handleSelect(item)}
                        activeOpacity={0.65}
                      >
                        <Text style={styles.resultFlag}>{flag}</Text>
                        <Text style={styles.resultText} numberOfLines={2}>{name}</Text>
                        <Text style={styles.resultChevron}>›</Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.menuBtn, showMenu && styles.menuBtnActive]}
            onPress={(e) => {
              e.stopPropagation();
              handleMenuToggle();
            }}
            activeOpacity={0.75}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {showMenu && (
          <View style={styles.menuDropdown}>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={(e) => { e.stopPropagation(); handleLanguageOption(); }}
              activeOpacity={0.7}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth={1.8}>
                <Circle cx="12" cy="12" r="10" />
                <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </Svg>
              <Text style={styles.menuItemText}>{t('menu_language')}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={(e) => { e.stopPropagation(); handlePrivacyOption(); }}
              activeOpacity={0.7}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth={1.8}>
                <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <Path d="M9 12l2 2 4-4" />
              </Svg>
              <Text style={styles.menuItemText}>{t('menu_privacy')}</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={(e) => { e.stopPropagation(); handleTooltipOption(); }}
              activeOpacity={0.7}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth={1.8}>
                <Rect x="3" y="5" width="4" height="4" rx="1" fill="#FFAA00" stroke="none" />
                <Line x1="10" y1="7" x2="21" y2="7" />
                <Rect x="3" y="13" width="4" height="4" rx="1" fill="#FFAA00" stroke="none" />
                <Line x1="10" y1="15" x2="21" y2="15" />
                <Rect x="3" y="21" width="4" height="4" rx="1" fill="#FFAA00" stroke="none" />
                <Line x1="10" y1="23" x2="21" y2="23" />
              </Svg>
              <Text style={styles.menuItemText}>{t('menu_tooltip')}</Text>
            </TouchableOpacity>

          </View>
        )}

        <PrivacyModal
          visible={showPrivacy}
          onClose={handlePrivacyClose}
        />

        <TooltipModal
          visible={showTooltip}
          onClose={handleTooltipClose}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const countryFlag = (code: string): string => {
  const upperCode = code.toUpperCase();
  return [...upperCode].map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('');
};

export { SearchBar };
export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    elevation: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.18)',
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  cardFocused: {
    shadowOpacity: 0.6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#E7E9EA',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  clearBtn: {
    padding: 2,
  },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFAA00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '700',
    lineHeight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFAA00',
    marginHorizontal: 14,
  },
  dropdown: {
    maxHeight: 280,
  },
  separator: {
    height: 1,
    backgroundColor: '#FFAA00',
    marginHorizontal: 14,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
  },
  resultFlag: {
    fontSize: 18,
  },
  resultText: {
    flex: 1,
    fontSize: 13.5,
    color: '#E7E9EA',
    lineHeight: 19,
  },
  resultChevron: {
    fontSize: 18,
    color: '#FFAA00',
    lineHeight: 20,
  },
  menuBtn: {
    width: 44,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  menuBtnActive: {
    borderColor: '#FFAA00',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  menuDots: {
    fontSize: 22,
    color: '#E7E9EA',
    lineHeight: 24,
    marginTop: -2,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.97)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFAA00',
    overflow: 'hidden',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
    minWidth: 140,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#fcc558',
    marginHorizontal: 12,
  },
  menuItemIcon: {
    fontSize: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: '#E7E9EA',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});