import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const COMMON_ICONS = ['✨', '🏃‍♂️', '💧', '📚', '🧘‍♀️', '🥦', '🛌', '💡', '🍎', '🍵', '🏋️‍♀️', '🎸'];

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (icon: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.label, { color: colors.icon }]}>Select Icon</Text>
            <View style={styles.iconGrid}>
                {COMMON_ICONS.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.iconItem,
                            { backgroundColor: colors.surface },
                            selectedIcon === item && { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primaryContainer }
                        ]}
                        onPress={() => onSelect(item)}
                    >
                        <Text style={styles.iconText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    iconItem: {
        width: '21%',
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        margin: '2%',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    iconText: {
        fontSize: 28,
    },
});
