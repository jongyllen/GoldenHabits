import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from '../constants/theme';

interface ProgressCardProps {
    progress: number; // 0 to 1
}

export default function ProgressCard({ progress }: ProgressCardProps) {
    const scheme = useColorScheme() ?? 'light';
    const colors = Colors[scheme];

    return (
        <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Daily Completion</Text>
                    <Text style={styles.subtitle}>
                        {Math.round(progress * 100)}% of habits done
                    </Text>
                </View>
                <View style={styles.percentageContainer}>
                    <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
                </View>
            </View>

            {/* Visual progress bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
        </LinearGradient>
    );
}

// Extends Number to include toInt like in Flutter if needed, 
// but in JS we can just use Math.round
const styles = StyleSheet.create({
    container: {
        padding: 24,
        borderRadius: 32,
        marginBottom: 24,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    percentageContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 20,
    },
    percentageText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 18,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFF',
    },
});
