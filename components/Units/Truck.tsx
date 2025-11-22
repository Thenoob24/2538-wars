// components/Units/Truck.tsx → COMPATIBLE AVEC useUnits
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GameConfig } from '../../constants/GameConfig';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

// Sprites du camion (inchangés)
const TRUCK_SPRITES = {
    blue: {
        front_empty_NE: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_empty_NE.png'),
        front_empty_NW: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_empty_NW.png'),
        front_loaded_NE: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_loaded_NE.png'),
        front_loaded_NW: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_loaded_NW.png'),
        rear_empty_SE: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_empty_SE.png'),
        rear_empty_SW: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_empty_SW.png'),
        rear_loaded_SE: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_loaded_SE.png'),
        rear_loaded_SW: require('../../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_loaded_SW.png'),
    },
};

interface TruckComponentProps {
    unit: any; // Unit générique avec type: 'truck'
    onPress?: () => void;
}

export function TruckComponent({ unit, onPress }: TruckComponentProps) {
    const isLoaded = unit.data?.isLoaded || false;
    const direction = unit.direction || 'SE';

    const view = (direction === 'NE' || direction === 'NW') ? 'front' : 'rear';
    const state = isLoaded ? 'loaded' : 'empty';
    const key = `${view}_${state}_${direction}` as keyof typeof TRUCK_SPRITES.blue;

    const sprite = TRUCK_SPRITES.blue[key] || TRUCK_SPRITES.blue.rear_empty_SE;

    const content = (
        <View style={styles.container}>
            <Image source={sprite} style={styles.image} resizeMode="contain" />
            {unit.movementPoints > 0 && (
                <View style={styles.movementIndicator}>
                    {[1, 2, 3, 4, 5].map(i => (
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
    container: { position: 'absolute', width: TILE_SIZE, height: TILE_SIZE, zIndex: 5 },
    image: { width: '100%', height: '100%' },
    movementIndicator: {
        position: 'absolute',
        bottom: -6,
        left: '10%',
        right: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#3b82f6' },
});