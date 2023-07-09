import type SVG from './svg';
export interface AspectData {
    degree: number;
    orbit: number;
    color: string;
}
export type Aspect = Record<string, AspectData>;
export interface Dignity {
    name: string;
    position: number;
    orbit: number;
}
export interface Settings {
    SYMBOL_SCALE: number;
    COLOR_BACKGROUND: string;
    POINTS_COLOR: string;
    POINTS_TEXT_SIZE: number;
    POINTS_STROKE: number;
    SIGNS_COLOR: string;
    SIGNS_STROKE: number;
    MARGIN: number;
    PADDING: number;
    ID_CHART: string;
    ID_RADIX: string;
    ID_TRANSIT: string;
    ID_ASPECTS: string;
    ID_POINTS: string;
    ID_SIGNS: string;
    ID_CIRCLES: string;
    ID_AXIS: string;
    ID_CUSPS: string;
    ID_RULER: string;
    ID_BG: string;
    CIRCLE_COLOR: string;
    CIRCLE_STRONG: number;
    LINE_COLOR: string;
    INDOOR_CIRCLE_RADIUS_RATIO: number;
    INNER_CIRCLE_RADIUS_RATIO: number;
    RULER_RADIUS: number;
    SYMBOL_SUN: string;
    SYMBOL_MOON: string;
    SYMBOL_MERCURY: string;
    SYMBOL_VENUS: string;
    SYMBOL_MARS: string;
    SYMBOL_JUPITER: string;
    SYMBOL_SATURN: string;
    SYMBOL_URANUS: string;
    SYMBOL_NEPTUNE: string;
    SYMBOL_PLUTO: string;
    SYMBOL_CHIRON: string;
    SYMBOL_LILITH: string;
    SYMBOL_NNODE: string;
    SYMBOL_SNODE: string;
    SYMBOL_AS: string;
    SYMBOL_DS: string;
    SYMBOL_MC: string;
    SYMBOL_IC: string;
    SYMBOL_AXIS_FONT_COLOR: string;
    SYMBOL_AXIS_STROKE: number;
    SYMBOL_CUSP_1: string;
    SYMBOL_CUSP_2: string;
    SYMBOL_CUSP_3: string;
    SYMBOL_CUSP_4: string;
    SYMBOL_CUSP_5: string;
    SYMBOL_CUSP_6: string;
    SYMBOL_CUSP_7: string;
    SYMBOL_CUSP_8: string;
    SYMBOL_CUSP_9: string;
    SYMBOL_CUSP_10: string;
    SYMBOL_CUSP_11: string;
    SYMBOL_CUSP_12: string;
    CUSPS_STROKE: number;
    CUSPS_FONT_COLOR: string;
    SYMBOL_ARIES: string;
    SYMBOL_TAURUS: string;
    SYMBOL_GEMINI: string;
    SYMBOL_CANCER: string;
    SYMBOL_LEO: string;
    SYMBOL_VIRGO: string;
    SYMBOL_LIBRA: string;
    SYMBOL_SCORPIO: string;
    SYMBOL_SAGITTARIUS: string;
    SYMBOL_CAPRICORN: string;
    SYMBOL_AQUARIUS: string;
    SYMBOL_PISCES: string;
    SYMBOL_SIGNS: string[];
    COLOR_ARIES: string;
    COLOR_TAURUS: string;
    COLOR_GEMINI: string;
    COLOR_CANCER: string;
    COLOR_LEO: string;
    COLOR_VIRGO: string;
    COLOR_LIBRA: string;
    COLOR_SCORPIO: string;
    COLOR_SAGITTARIUS: string;
    COLOR_CAPRICORN: string;
    COLOR_AQUARIUS: string;
    COLOR_PISCES: string;
    COLORS_SIGNS: string[];
    CUSTOM_SYMBOL_FN: null | ((name: string, x: number, y: number, context: SVG) => Element);
    SHIFT_IN_DEGREES: number;
    STROKE_ONLY: boolean;
    ADD_CLICK_AREA: boolean;
    COLLISION_RADIUS: number;
    ASPECTS: Aspect;
    DIGNITIES_RULERSHIP: string;
    DIGNITIES_DETRIMENT: string;
    DIGNITIES_EXALTATION: string;
    DIGNITIES_EXACT_EXALTATION: string;
    DIGNITIES_FALL: string;
    DIGNITIES_EXACT_EXALTATION_DEFAULT: Dignity[];
    ANIMATION_CUSPS_ROTATION_SPEED: number;
    DEBUG: boolean;
}
declare const default_settings: Settings;
export default default_settings;
