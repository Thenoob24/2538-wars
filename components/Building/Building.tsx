// components/Building.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { GameConfig } from '../../constants/GameConfig';

const TILE_SIZE = GameConfig.TILE_DISPLAY_SIZE;

export type BuildingType = 'base' | 'turret' | 'factory' | 'mine';
export type BuildingTeam = 'blue' | 'red' | 'green' | 'yellow' | 'neutral';

interface Building {
    id: string;
    type: BuildingType;
    team: BuildingTeam;
    level: number; // 1 à 5 (ou 1 à 6 pour les mines dorées par exemple)
    x: number; // position en tuiles
    y: number;
    width: number; // largeur en tuiles
    height: number; // hauteur en tuiles
    health?: number;        // optionnel pour les mines indestructibles
    maxHealth?: number;
}

interface BuildingComponentProps {
    building: Building;
    onPress?: (building: Building) => void;
}

// ──────────────────────────────────────────────────────────────
// ASSETS
const BUILDING_ASSETS: Record<BuildingTeam, Record<BuildingType, Record<number, any>>> = {
    blue: {
        base: {
            1: require('../../assets/faction/United-Nation/Building/Headquarter/base_blue_level1.png'),
            2: require('../../assets/faction/United-Nation/Building/Headquarter/base_blue_level2.png'),
            3: require('../../assets/faction/United-Nation/Building/Headquarter/base_blue_level3.png'),
            4: require('../../assets/faction/United-Nation/Building/Headquarter/base_blue_level4.png'),
            5: require('../../assets/faction/United-Nation/Building/Headquarter/base_blue_level5.png'),
        },
        barrack: {
            1: require('../../assets/faction/United-Nation/Building/Barrack/barrack_blue_level1.png'),
            2: require('../../assets/faction/United-Nation/Building/Barrack/barrack_blue_level2.png'),
            3: require('../../assets/faction/United-Nation/Building/Barrack/barrack_blue_level3.png'),
            4: require('../../assets/faction/United-Nation/Building/Barrack/barrack_blue_level4.png'),
            5: require('../../assets/faction/United-Nation/Building/Barrack/barrack_blue_level5.png'),
        },
        turret: {},
        factory: {},
        mine: {}, // pas de mine bleue
    },
    red: { base: {}, turret: {}, factory: {}, mine: {} },
    green: { base: {}, turret: {}, factory: {}, mine: {} },
    yellow: { base: {}, turret: {}, factory: {}, mine: {} },

    // ─── NEUTRE (mines dorées/oranges) ─────────────────────────────
    neutral: {
        base: {},
        turret: {},
        factory: {},
        mine: {
            1: require('../../assets/faction/Neutral/Building/Mine/base_gold_level1.png'),
            2: require('../../assets/faction/Neutral/Building/Mine/base_gold_level2.png'),
            3: require('../../assets/faction/Neutral/Building/Mine/base_gold_level3.png'),
            4: require('../../assets/faction/Neutral/Building/Mine/base_gold_level4.png'),
            5: require('../../assets/faction/Neutral/Building/Mine/base_gold_level5.png'),
        },
    },
};
// ──────────────────────────────────────────────────────────────

export function BuildingComponent({ building, onPress }: BuildingComponentProps) {
    const asset =
        BUILDING_ASSETS[building.team]?.[building.type]?.[building.level]


    const buildingWidth = building.width * TILE_SIZE;
    const buildingHeight = building.height * TILE_SIZE;

    const showHealthBar = building.health !== undefined && building.maxHealth !== undefined;

    const content = (
        <View style={[styles.container, { width: buildingWidth, height: buildingHeight }]}>
            <Image source={asset} style={styles.image} resizeMode="contain" />
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => onPress(building)}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

function getHealthColor(healthPercent: number): string {
    if (healthPercent > 0.6) return '#22c55e';
    if (healthPercent > 0.3) return '#f59e0b';
    return '#ef4444';
}

export function getBuildingIcon(building: Building): any {
    return BUILDING_ASSETS[building.team]?.[building.type]?.[building.level];
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    healthBarContainer: {
        position: 'absolute',
        bottom: -10,
        left: '8%',
        right: '8%',
    },
    healthBarBackground: {
        height: 8,
        backgroundColor: '#1f2937',
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#374151',
    },
    healthBarFill: {
        height: '100%',
    },
});

export type { Building };