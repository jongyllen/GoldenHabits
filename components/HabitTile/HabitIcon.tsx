import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface HabitIconProps {
    icon: string;
    isCompleted: boolean;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ icon, isCompleted }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.iconContainer}>
            {isCompleted ? (
                <LinearGradient
                    colors={colors.goldGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconGradient}
                >
                    <Text style={styles.iconText}>{icon}</Text>
                </LinearGradient>
            ) : (
                <View style={[styles.iconPlaceholder, { backgroundColor: colors.primaryContainer }]}>
                    <Text style={styles.iconText}>{icon}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        marginRight: 16,
    },
    iconGradient: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: 24,
    },
});
