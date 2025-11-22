// components/Units/Engineer.tsx → COMPATIBLE AVEC useUnits
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GameConfig } from '../../constants/GameConfig';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

const ENGINEER_SPRITES = {
    blue: {
        NE: require('../../assets/faction/United-Nation/Units/Engineer/engineer_blue_NE.png'),
        NW: require('../../assets/faction/United-Nation/Units/Engineer/engineer_blue_NW.png'),
        SE: require('../../assets/faction/United-Nation/Units/Engineer/engineer_blue_SE.png'),
        SW: require('../../assets/faction/United-Nation/Units/Engineer/engineer_blue_SW.png'),
    },
};

interface EngineerComponentProps {
    unit: any;
    onPress?: () => void;
}

export function EngineerComponent({ unit, onPress }: EngineerComponentProps) {
    const direction = unit.direction || 'SE';
    const sprite = ENGINEER_SPRITES.blue[direction] || ENGINEER_SPRITES.blue.SE;

    const content = (
        <View style={styles.container}>
            <Image source={sprite} style={styles.image} resizeMode="contain" />
            {unit.movementPoints > 0 && (
                <View style={styles.movementIndicator}>
                    {[1, 2, 3, 4].map(i => (
                        <View
                            key={i}
                            style={[styles.dot, { opacity: unit.movementPoints >= i ? 1 : 0.3 }]}
                        />
                    ))}
                </View>
            )}
        </View>
    );

    if (onPress) {
        return <TouchableOpacity activeOpacity={0.8} onPress={onPress}>{content}</TouchableOpacity>;
    }
    return content;
}

const styles = StyleSheet.create({
    container: { position: 'absolute', width: TILE_SIZE, height: TILE_SIZE, zIndex: 6 },
    image: { width: '100%', height: '100%' },
    movementIndicator: {
        position: 'absolute',
        bottom: -6,
        left: '15%',
        right: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#10b981' },
});