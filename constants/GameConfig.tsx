// constants/GameConfig.ts

export const GameConfig = {
    // Taille de la grille
    GRID_SIZE: 32,

    // Taille d'une tuile à l'écran (en pixels)
    TILE_DISPLAY_SIZE: 64,

    // Configuration du tileset
    // constants/GameConfig.ts
    TILESET: {
        TILE_WIDTH: 98,      // ✅ Cellule 98×97px
        TILE_HEIGHT: 97,     // ✅ (pas 64×64)
        COLUMNS: 8,          // ✅ 8 colonnes (pas 12)
        ROWS: 12,            // ✅ 12 lignes (pas 8)
        TOTAL_TILES: 96,     // ✅ 96 tuiles
        SPACING: 0,          // ✅ Pas d'espacement
        MARGIN: 0,           // ✅ Pas de marge
    },

    // Chemins des assets
    ASSETS: {
        TILESET: require('@/assets/tiles/terrain/tileset_terrain.png'),
    },
};

// Fonction pour obtenir la position d'une tuile dans le tileset
export function getTilePosition(tileIndex: number) {
    const col = tileIndex % GameConfig.TILESET.COLUMNS;
    const row = Math.floor(tileIndex / GameConfig.TILESET.COLUMNS);

    return {
        x: col * GameConfig.TILESET.TILE_WIDTH,
        y: row * GameConfig.TILESET.TILE_HEIGHT,
    };
}

// Fonction pour obtenir les dimensions d'une tuile
export function getTileDimensions() {
    return {
        width: GameConfig.TILESET.TILE_WIDTH,
        height: GameConfig.TILESET.TILE_HEIGHT,
    };
}