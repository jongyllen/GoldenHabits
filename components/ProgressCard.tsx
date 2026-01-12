import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ProgressCardProps {
    progress: number; // 0 to 1
    totalHabits: number;
    completedHabits: number;
}

export default function ProgressCard({ progress, totalHabits, completedHabits }: ProgressCardProps) {
    const { colors } = useTheme();

    return (
        <LinearGradient
            colors={colors.tealGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, colors.cardShadow]}
        >
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Daily Momentum</Text>
                    <Text style={styles.subtitle}>
                        {progress === 1 ? 'Perfect day! You cleared it all. ✨' : `${Math.round(progress * 100)}% of your habits are crushed today.`}
                    </Text>
                </View>
                <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>{Math.round(progress * 100)}%</Text>
                </View>
            </View>

            <View style={styles.progressBarWrapper}>
                <View style={styles.progressBarTrack}>
                    <LinearGradient
                        colors={['#FFF', 'rgba(255,255,255,0.7)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
                    />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        borderRadius: 32,
        marginBottom: 24,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
    },
    percentageBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    percentageText: {
        color: '#FFF',
        fontWeight: '800',
        fontSize: 18,
    },
    progressBarWrapper: {
        marginTop: 'auto',
    },
    progressBarTrack: {
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
});

