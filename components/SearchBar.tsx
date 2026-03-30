//components/SearchBar.tsx
import React, { useState, useRef } from 'react';
import {
  View, TextInput, TouchableOpacity, FlatList,
  Text, StyleSheet, ActivityIndicator, Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { NominatimResult } from '../types/weather';
import { searchPlaces, formatPlaceName } from '../utils/nominatim';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSelectResult: (result: NominatimResult) => void;
  onLanguagePress: () => void;
}

const SearchBar: React.FC<Props> = ({ value, onChangeText, onSelectResult, onLanguagePress }) => {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { t, language } = useLanguage();

  // Search only when the user presses the Search/Enter key
  const handleSubmit = async () => {
    const query = value.trim();
    if (query.length < 2) return;
    Keyboard.dismiss();
    setShowMenu(false);
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
    setShowMenu((prev) => !prev);
  };

  const handleLanguageOption = () => {
    setShowMenu(false);
    onLanguagePress();
  };

  const languageLabel = language === 'pt' ? 'Idioma' : 'Language';

  return (
    <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
      <View style={styles.wrapper}>
        <View style={styles.row}>
          {/* Main pill input */}
          <View style={[styles.card, focused && styles.cardFocused]}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={t('search_placeholder')}
                placeholderTextColor="#7cb9e8"
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="words"
                onFocus={() => { setFocused(true); setShowMenu(false); }}
                onBlur={() => setFocused(false)}
                onSubmitEditing={handleSubmit}
              />

              {value.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <View style={styles.clearCircle}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Results dropdown */}
            {showDropdown && (
              <View style={styles.dropdown}>
                <View style={styles.divider} />
                <FlatList
                  data={results}
                  keyExtractor={(item) => String(item.place_id)}
                  keyboardShouldPersistTaps="handled"
                  scrollEnabled={true}
                  style={{maxHeight:260}}
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

          {/* Three-dot menu button */}
          <TouchableOpacity
            style={[styles.menuBtn, showMenu && styles.menuBtnActive]}
            onPress={handleMenuToggle}
            activeOpacity={0.75}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.menuDots}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown menu */}
        {showMenu && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLanguageOption}
              activeOpacity={0.7}
            >
              <Text style={styles.menuItemIcon}>🌐</Text>
              <Text style={styles.menuItemText}>{languageLabel}</Text>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: 'rgba(10, 24, 40, 0.88)',
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
    color: '#e0f4ff',
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
    backgroundColor: 'rgba(74, 127, 165, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    fontSize: 10,
    color: '#7cb9e8',
    fontWeight: '700',
    lineHeight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#7cb9e8',
    marginHorizontal: 14,
  },
  dropdown: {
    maxHeight: 280,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(63, 166, 255, 0.6)',
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
    color: '#c5dff0',
    lineHeight: 19,
  },
  resultChevron: {
    fontSize: 18,
    color: '#81caff',
    lineHeight: 20,
  },
  menuBtn: {
    width: 44,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 24, 40, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(130, 213, 252, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  menuBtnActive: {
    borderColor: 'rgba(79, 195, 247, 0.55)',
    backgroundColor: 'rgba(14, 51, 86, 0.95)',
  },
  menuDots: {
    fontSize: 22,
    color: '#7cb9e8',
    lineHeight: 24,
    marginTop: -2,
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 0,
    backgroundColor: 'rgba(10, 24, 40, 0.97)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(79, 195, 247, 0.22)',
    overflow: 'hidden',
    shadowColor: '#000',
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
  menuItemIcon: {
    fontSize: 16,
  },
  menuItemText: {
    fontSize: 14,
    color: '#c5dff0',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});