import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface GoalSettingsProps {
    targetValue: string;
    unit: string;
    goalDaysPerWeek: number;
    onTargetValueChange: (value: string) => void;
    onUnitChange: (unit: string) => void;
    onGoalDaysChange: (days: number) => void;
}

export const GoalSettings: React.FC<GoalSettingsProps> = ({
    targetValue,
    unit,
    goalDaysPerWeek,
    onTargetValueChange,
    onUnitChange,
    onGoalDaysChange,
}) => {
    const { colors } = useTheme();

    return (
        <>
            <View style={styles.section}>
                <Text style={[styles.label, { color: colors.icon }]}>Quantitative Goal (Optional)</Text>
                <Text style={[styles.helperText, { color: colors.icon }]}>e.g. 5 glasses, 15 pushups, 30 minutes</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 12, color: colors.onSurface, borderColor: colors.primaryContainer, backgroundColor: colors.surface }]}
                        placeholder="Amount (e.g. 10)"
                        placeholderTextColor={colors.icon}
                        value={targetValue}
                        onChangeText={onTargetValueChange}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[styles.input, { flex: 2, color: colors.onSurface, borderColor: colors.primaryContainer, backgroundColor: colors.surface }]}
                        placeholder="Unit (e.g. mins)"
                        placeholderTextColor={colors.icon}
                        value={unit}
                        onChangeText={onUnitChange}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.label, { color: colors.icon }]}>Weekly Goal</Text>
                <Text style={[styles.helperText, { color: colors.icon }]}>How many days per week do you want to do this?</Text>
                <View style={styles.frequencyContainer}>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <TouchableOpacity
                            key={num}
                            style={[
                                styles.frequencyItem,
                                { backgroundColor: colors.surface, borderColor: colors.primaryContainer },
                                goalDaysPerWeek === num && { backgroundColor: colors.primary, borderColor: colors.primary }
                            ]}
                            onPress={() => onGoalDaysChange(num)}
                        >
                            <Text style={[
                                styles.frequencyText,
                                { color: goalDaysPerWeek === num ? '#FFF' : colors.onSurface }
                            ]}>
                                {num}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </>
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
    helperText: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 8,
        opacity: 0.8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        height: 60,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 18,
        fontWeight: '500',
        borderWidth: 1,
    },
    frequencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    frequencyItem: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    frequencyText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
