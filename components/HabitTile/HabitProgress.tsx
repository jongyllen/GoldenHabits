import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface HabitProgressProps {
    progressPercent: number;
    isCompleted: boolean;
}

export const HabitProgress: React.FC<HabitProgressProps> = ({ progressPercent, isCompleted }) => {
    const { colors } = useTheme();

    if (progressPercent <= 0) return null;

    return (
        <View
            style={[
                styles.progressOverlay,
                {
                    width: `${progressPercent * 100}%`,
                    backgroundColor: isCompleted ? colors.primary + '1A' : colors.primary + '0D'
                }
            ]}
        />
    );
};

const styles = StyleSheet.create({
    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
});
