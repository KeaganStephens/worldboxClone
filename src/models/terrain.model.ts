export type TerrainId = 'soil' | 'grass' | 'sand' | 'water';

export interface TerrainDef {
  id: TerrainId;
  label: string;
  color: string;
  shade: string;
  foam: string;
  traversable: boolean;
}

export const TERRAINS: Record<TerrainId, TerrainDef> = {
  soil: {
    id: 'soil',
    label: 'Tanah',
    color: '#8d6e63',
    shade: '#6d4c41',
    foam: '#a1887f',
    traversable: true,
  },
  grass: {
    id: 'grass',
    label: 'Rumput',
    color: '#4caf50',
    shade: '#388e3c',
    foam: '#81c784',
    traversable: true,
  },
  sand: {
    id: 'sand',
    label: 'Pasir',
    color: '#e6d29a',
    shade: '#c2a86a',
    foam: '#f0e6bf',
    traversable: true,
  },
  water: {
    id: 'water',
    label: 'Air',
    color: '#8ecae6',
    shade: '#5aa9cc',
    foam: '#d6f0fb',
    traversable: false,
  },
};

export const TERRAIN_LIST: TerrainDef[] = [
  TERRAINS.soil,
  TERRAINS.grass,
  TERRAINS.sand,
  TERRAINS.water,
];

export const DEFAULT_TERRAIN: TerrainId = 'grass';
export const ERASER_TERRAIN: TerrainId = 'water';
export const WATER_FRAMES = 3;
export const WATER_FRAME_MS = 350;
