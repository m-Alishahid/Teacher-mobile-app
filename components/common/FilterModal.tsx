import { BorderRadius, FontSizes, Spacing } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '../ui/icon-symbol';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function FilterModal({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: FilterModalProps) {
  const { colors, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[styles.modalOverlay, { backgroundColor: colors.ui.overlay }]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.filterModalContent, { backgroundColor: colors.ui.card }]}>
          <Text style={[styles.filterModalTitle, { color: colors.text.primary }]}>{title}</Text>
          <ScrollView style={styles.filterModalScroll}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterModalOption,
                  selectedValue === option && { backgroundColor: isDark ? colors.background.tertiary : colors.background.secondary },
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.filterModalOptionText,
                    { color: colors.text.primary },
                    selectedValue === option && { color: colors.primary.main, fontWeight: '700' },
                  ]}
                >
                  {option}
                </Text>
                {selectedValue === option && (
                  <IconSymbol name="checkmark" size={20} color={colors.primary.main} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  filterModalContent: {
    width: '100%',
    maxHeight: '50%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  filterModalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  filterModalScroll: {
    maxHeight: 300,
  },
  filterModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  filterModalOptionText: {
    fontSize: FontSizes.base,
  },
});
