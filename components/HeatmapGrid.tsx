import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface HeatmapGridProps {
    data: Record<string, number>; // date string -> completion percentage (0-1)
    daysToShow?: number;
}

export default function HeatmapGrid({ data, daysToShow = 91 }: HeatmapGridProps) {
    const { colors } = useTheme();

    const { weeks, monthLabels, getIntensity, getColor } = useMemo(() => {
        const today = new Date();
        const dates = [...Array(daysToShow)].map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(today.getDate() - (daysToShow - 1 - i));
            return d;
        });

        const getIntensity = (date: Date) => {
            const key = date.toDateString();
            const percentage = data[key] || 0;
            if (percentage === 0) return 0;
            if (percentage <= 0.33) return 1;
            if (percentage <= 0.66) return 2;
            return 3;
        };

        const getColor = (intensity: number) => {
            if (intensity === 0) return 'rgba(0,0,0,0.05)';
            if (intensity === 1) return colors.primary + '4D'; // 30% opacity
            if (intensity === 2) return colors.primary + '99'; // 60% opacity
            return colors.primary;
        };

        // Group by weeks for the grid
        const weeks: Date[][] = [];
        let currentWeek: Date[] = [];

        dates.forEach((date, i) => {
            currentWeek.push(date);
            if (currentWeek.length === 7 || i === dates.length - 1) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        });

        // Calculate month labels
        const monthLabels: { label: string; index: number }[] = [];
        weeks.forEach((week, i) => {
            const firstDay = week[0];
            if (firstDay.getDate() <= 7) {
                const label = firstDay.toLocaleDateString('en-US', { month: 'short' });
                if (!monthLabels.find(ml => ml.label === label)) {
                    monthLabels.push({ label, index: i });
                }
            }
        });

        return { weeks, monthLabels, getIntensity, getColor };
    }, [data, daysToShow, colors.primary]);

    return (
        <View style={[styles.container, { backgroundColor: colors.surface }, colors.cardShadow]}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Activity Heatmap</Text>

            <View style={styles.gridWrapper}>
                <View style={styles.monthRow}>
                    {monthLabels.map((ml, i) => (
                        <Text
                            key={i}
                            style={[
                                styles.monthLabel,
                                { color: colors.icon, left: ml.index * 16 }
                            ]}
                        >
                            {ml.label}
                        </Text>
                    ))}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.grid}>
                        {weeks.map((week, weekIndex) => (
                            <View key={weekIndex} style={styles.weekColumn}>
                                {week.map((date, dateIndex) => {
                                    const intensity = getIntensity(date);
                                    return (
                                        <View
                                            key={dateIndex}
                                            style={[
                                                styles.square,
                                                {
                                                    backgroundColor: getColor(intensity),
                                                },
                                            ]}
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <View style={styles.legend}>
                <Text style={[styles.legendText, { color: colors.icon }]}>Less</Text>
                <View style={[styles.square, { backgroundColor: 'rgba(0,0,0,0.05)' }]} />
                <View style={[styles.square, { backgroundColor: colors.primary + '4D' }]} />
                <View style={[styles.square, { backgroundColor: colors.primary + '99' }]} />
                <View style={[styles.square, { backgroundColor: colors.primary }]} />
                <Text style={[styles.legendText, { color: colors.icon }]}>More</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 28,
        marginVertical: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
    },
    gridWrapper: {
        height: 140,
        justifyContent: 'flex-end',
    },
    monthRow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
    },
    monthLabel: {
        position: 'absolute',
        fontSize: 10,
        fontWeight: '600',
    },
    scrollContent: {
        paddingRight: 10,
        paddingTop: 20,
    },
    grid: {
        flexDirection: 'row',
        gap: 4,
    },
    weekColumn: {
        flexDirection: 'column',
        gap: 4,
    },
    square: {
        width: 12,
        height: 12,
        borderRadius: 3,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 4,
    },
    legendText: {
        fontSize: 10,
        fontWeight: '600',
        marginHorizontal: 4,
    },
});
