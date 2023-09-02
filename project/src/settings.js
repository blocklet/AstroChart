// ## Settings #############################
(function (astrology) {
  //Scale of symbols 控制符号的缩放
  astrology.SYMBOL_SCALE = 1;

  // BG color 背景颜色
  astrology.COLOR_BACKGROUND = "#00000000";

  // Color of planet's symbols 行星图标的颜色
  astrology.POINTS_COLOR = "#D4C9FF";

  // Color of planet's symbols 行星高亮的颜色
  astrology.POINT_HIGHLIGHT_COLOR = "#fbfbfb";
  // astrology.POINT_HIGHLIGHT_COLOR = "#FF0000";

  // Size of description text next to the planet: angle, retrograde, dignities, ...
  astrology.POINTS_TEXT_SIZE = 8;

  // Points strength of lines 行星图标的线条尺寸
  astrology.POINTS_STROKE = 1;

  // Font color of signs symbols  星座图标的颜色
  astrology.SIGNS_COLOR = "#161548";

  // Signs strength of lines 星座图标的粗细
  astrology.SIGNS_STROKE = 1;

  // Chart margin 星盘的 margin
  astrology.MARGIN = 20; //px

  // Chart Padding 星盘的 padding
  astrology.PADDING = 8; //px

  // Module wrapper element ID
  astrology.ID_CHART = "aistro";

  // Radix chart element ID
  astrology.ID_RADIX = "radix";

  // Transit chart element ID
  astrology.ID_TRANSIT = "transit";

  // Aspects wrapper element ID
  astrology.ID_ASPECTS = "aspects";

  // Aspects wrapper element ID
  astrology.ID_POINTS = "planets";

  // Signs wrapper element ID
  astrology.ID_SIGNS = "signs";

  // Circles wrapper element ID
  astrology.ID_CIRCLES = "circles";

  // Axis wrapper element ID
  astrology.ID_AXIS = "axis";

  // Cusps wrapper element ID
  astrology.ID_CUSPS = "cusps";

  // Cusps wrapper element ID
  astrology.ID_RULER = "ruler";

  // Background wrapper element ID
  astrology.ID_BG = "bg";

  // Color of circles in charts 圆圈线条的颜色
  astrology.CIRCLE_COLOR = "#D4C9FF";

  // Circles strength of lines  圆圈线条的粗细
  astrology.CIRCLE_STRONG = 1;

  // Color of lines in charts 内部线条的颜色
  astrology.LINE_COLOR = "#D4C9FF";

  // radius / INDOOR_CIRCLE_RADIUS_RATIO 内部圆的比例
  astrology.INDOOR_CIRCLE_RADIUS_RATIO = 1.8;

  // radius - radius/INNER_CIRCLE_RADIUS_RATIO 外部圆的比例
  astrology.INNER_CIRCLE_RADIUS_RATIO = 8;

  // ( radius / astrology.INNER_CIRCLE_RADIUS_RATIO ) / astrology.RULER_RADIUS
  astrology.RULER_RADIUS = 4;

  // Points
  astrology.SYMBOL_SUN = "Sun";
  astrology.SYMBOL_MOON = "Moon";
  astrology.SYMBOL_MERCURY = "Mercury";
  astrology.SYMBOL_VENUS = "Venus";
  astrology.SYMBOL_MARS = "Mars";
  astrology.SYMBOL_JUPITER = "Jupiter";
  astrology.SYMBOL_SATURN = "Saturn";
  astrology.SYMBOL_URANUS = "Uranus";
  astrology.SYMBOL_NEPTUNE = "Neptune";
  astrology.SYMBOL_PLUTO = "Pluto";
  astrology.SYMBOL_CHIRON = "Chiron";
  astrology.SYMBOL_LILITH = "Lilith";
  astrology.SYMBOL_NNODE = "NNode";
  astrology.SYMBOL_ASCENDANT = "Ascendant";

  // Axis
  astrology.SYMBOL_AS = "As";
  astrology.SYMBOL_DS = "Ds";
  astrology.SYMBOL_MC = "Mc";
  astrology.SYMBOL_IC = "Ic";

  // 基本点的颜色 - 用不到
  astrology.SYMBOL_AXIS_FONT_COLOR = "#00000000";
  astrology.SYMBOL_AXIS_STROKE = 1;

  // Cusps
  astrology.SYMBOL_CUSP_1 = "1";
  astrology.SYMBOL_CUSP_2 = "2";
  astrology.SYMBOL_CUSP_3 = "3";
  astrology.SYMBOL_CUSP_4 = "4";
  astrology.SYMBOL_CUSP_5 = "5";
  astrology.SYMBOL_CUSP_6 = "6";
  astrology.SYMBOL_CUSP_7 = "7";
  astrology.SYMBOL_CUSP_8 = "8";
  astrology.SYMBOL_CUSP_9 = "9";
  astrology.SYMBOL_CUSP_10 = "10";
  astrology.SYMBOL_CUSP_11 = "11";
  astrology.SYMBOL_CUSP_12 = "12";

  // Cusps strength of lines 圆圈内月角线的尺寸
  astrology.CUSPS_STROKE = 1;
  astrology.CUSPS_FONT_COLOR = "#D4C9FF";

  //Signs
  astrology.SYMBOL_ARIES = "Aries";
  astrology.SYMBOL_TAURUS = "Taurus";
  astrology.SYMBOL_GEMINI = "Gemini";
  astrology.SYMBOL_CANCER = "Cancer";
  astrology.SYMBOL_LEO = "Leo";
  astrology.SYMBOL_VIRGO = "Virgo";
  astrology.SYMBOL_LIBRA = "Libra";
  astrology.SYMBOL_SCORPIO = "Scorpio";
  astrology.SYMBOL_SAGITTARIUS = "Sagittarius";
  astrology.SYMBOL_CAPRICORN = "Capricorn";
  astrology.SYMBOL_AQUARIUS = "Aquarius";
  astrology.SYMBOL_PISCES = "Pisces";
  astrology.SYMBOL_SIGNS = [
    astrology.SYMBOL_ARIES,
    astrology.SYMBOL_TAURUS,
    astrology.SYMBOL_GEMINI,
    astrology.SYMBOL_CANCER,
    astrology.SYMBOL_LEO,
    astrology.SYMBOL_VIRGO,
    astrology.SYMBOL_LIBRA,
    astrology.SYMBOL_SCORPIO,
    astrology.SYMBOL_SAGITTARIUS,
    astrology.SYMBOL_CAPRICORN,
    astrology.SYMBOL_AQUARIUS,
    astrology.SYMBOL_PISCES,
  ];

  // http://www.rapidtables.com/web/color/html-color-codes.htm
  astrology.COLOR_ARIES = "#D4C9FF";
  astrology.COLOR_TAURUS = "#D4C9FF";
  astrology.COLOR_GEMINI = "#D4C9FF";
  astrology.COLOR_CANCER = "#D4C9FF";
  astrology.COLOR_LEO = "#D4C9FF";
  astrology.COLOR_VIRGO = "#D4C9FF";
  astrology.COLOR_LIBRA = "#D4C9FF";
  astrology.COLOR_SCORPIO = "#D4C9FF";
  astrology.COLOR_SAGITTARIUS = "#D4C9FF";
  astrology.COLOR_CAPRICORN = "#D4C9FF";
  astrology.COLOR_AQUARIUS = "#D4C9FF";
  astrology.COLOR_PISCES = "#D4C9FF";
  astrology.COLORS_SIGNS = [
    astrology.COLOR_ARIES,
    astrology.COLOR_TAURUS,
    astrology.COLOR_GEMINI,
    astrology.COLOR_CANCER,
    astrology.COLOR_LEO,
    astrology.COLOR_VIRGO,
    astrology.COLOR_LIBRA,
    astrology.COLOR_SCORPIO,
    astrology.COLOR_SAGITTARIUS,
    astrology.COLOR_CAPRICORN,
    astrology.COLOR_AQUARIUS,
    astrology.COLOR_PISCES,
  ];

  astrology.CUSTOM_SYMBOL_FN = null;

  // 0 degree is on the West
  astrology.SHIFT_IN_DEGREES = 180;

  // No fill, only stroke
  astrology.STROKE_ONLY = false;

  astrology.ADD_CLICK_AREA = false;

  // Planets collision circle radius for astrology.SYMBOL_SCALE = 1
  // Scaling changes the collision radius
  astrology.COLLISION_RADIUS = 10; //px

  // Aspects 方位线的颜色
  astrology.ASPECTS = {
    conjunction: { degree: 0, orbit: 10, color: "transparent" },
    square: { degree: 90, orbit: 8, color: "#D4C9FF" },
    trine: { degree: 120, orbit: 8, color: "#D4C9FF" },
    opposition: { degree: 180, orbit: 10, color: "#D4C9FF" },
  };

  // Dignities
  astrology.DIGNITIES_RULERSHIP = "r";
  astrology.DIGNITIES_DETRIMENT = "d";
  astrology.DIGNITIES_EXALTATION = "e";
  astrology.DIGNITIES_EXACT_EXALTATION = "E";
  astrology.DIGNITIES_FALL = "f";

  // Source: Aleister Crowley
  astrology.DIGNITIES_EXACT_EXALTATION_DEFAULT = [
    { name: "Sun", position: 19, orbit: 2 }, // 19 Arise
    { name: "Moon", position: 33, orbit: 2 }, //3 Taurus
    { name: "Mercury", position: 155, orbit: 2 }, //15 Virgo
    { name: "Venus", position: 357, orbit: 2 }, //27 Pisces
    { name: "Mars", position: 298, orbit: 2 }, //28 Capricorn
    { name: "Jupiter", position: 105, orbit: 2 }, //15 Cancer
    { name: "Saturn", position: 201, orbit: 2 }, //21 Libra
    { name: "NNode", position: 63, orbit: 2 }, //3 Geminy
  ];

  // 0 - 4
  astrology.ANIMATION_CUSPS_ROTATION_SPEED = 2;

  astrology.DEBUG = false;
})((window.astrology = window.astrology || {}));
