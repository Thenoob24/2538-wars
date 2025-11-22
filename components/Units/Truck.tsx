// components/Truck.tsx → VERSION FINALE (avec icône HUD propre)
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GameConfig } from '../constants/GameConfig';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

export type TruckDirection = 'NE' | 'NW' | 'SE' | 'SW';
export type TruckTeam = 'blue' | 'red' | 'green' | 'yellow';

export interface Truck {
    id: string;
    team: TruckTeam;
    x: number;
    y: number;
    direction: TruckDirection;
    isLoaded: boolean;
    targetX?: number;
    targetY?: number;
    movementPoints: number;
    isMoving?: boolean;
}

// ICÔNE PAR DÉFAUT pour le HUD → on prend le sprite SE vide (très beau et centré)
export const DEFAULT_TRUCK_ICON = require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_empty_SE.png');

// Tous les sprites du camion
const TRUCK_SPRITES = {
    blue: {
        front_empty_NE: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_empty_NE.png'),
        front_empty_NW: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_empty_NW.png'),
        front_loaded_NE: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_loaded_NE.png'),
        front_loaded_NW: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_rear_loaded_NW.png'),
        rear_empty_SE: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_empty_SE.png'),
        rear_empty_SW: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_empty_SW.png'),
        rear_loaded_SE: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_loaded_SE.png'),
        rear_loaded_SW: require('../assets/faction/United-Nation/Units/RessourceTruck/ressource_truck_front_loaded_SW.png'),
    },
};

// Fonction pour récupérer l'image dynamique du camion sélectionné
export function getTruckIcon(truck: Truck): any {
    const state = truck.isLoaded ? 'loaded' : 'empty';
    const view = (truck.direction === 'NE' || truck.direction === 'NW') ? 'front' : 'rear';
    const key = `${view}_${state}_${truck.direction}` as keyof typeof TRUCK_SPRITES.blue;
    return TRUCK_SPRITES[truck.team][key];
}

interface TruckComponentProps {
    truck: Truck;
    onPress?: (truck: Truck) => void;
}

export function TruckComponent({ truck, onPress }: TruckComponentProps) {
    const getTruckSprite = () => {
        const state = truck.isLoaded ? 'loaded' : 'empty';
        const view = (truck.direction === 'NE' || truck.direction === 'NW') ? 'front' : 'rear';
        const key = `${view}_${state}_${truck.direction}` as keyof typeof TRUCK_SPRITES.blue;
        return TRUCK_SPRITES[truck.team][key];
    };

    const content = (
        <View style={styles.container}>
            <Image source={getTruckSprite()} style={styles.image} resizeMode="contain" />

            {/* Indicateur de points de mouvement */}
            {truck.movementPoints > 0 && (
                <View style={styles.movementIndicator}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View
                            key={i}
                            style={[
                                styles.movementDot,
                                { opacity: truck.movementPoints >= i ? 1 : 0.3 },
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(truck)}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: TILE_SIZE,
        height: TILE_SIZE,
        zIndex: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    movementIndicator: {
        position: 'absolute',
        bottom: -6,
        left: '5%',
        right: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    movementDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#3b82f6',
    },
});

export type { Truck };