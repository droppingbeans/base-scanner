/**
 * Coinbase Design System Color Tokens
 * Source: https://github.com/coinbase/cds
 * Using their exact RGB values for authenticity
 */

export const coinbaseColors = {
  // Blue Spectrum (Light Mode)
  blue: {
    0: 'rgb(245, 248, 255)',
    5: 'rgb(211, 225, 255)',
    10: 'rgb(176, 202, 255)',
    15: 'rgb(146, 182, 255)',
    20: 'rgb(115, 162, 255)',
    30: 'rgb(70, 132, 255)',
    40: 'rgb(38, 110, 255)',
    50: 'rgb(16, 94, 255)',
    60: 'rgb(0, 82, 255)',     // Primary Coinbase Blue
    70: 'rgb(0, 75, 235)',
    80: 'rgb(0, 62, 193)',
    90: 'rgb(0, 41, 130)',
    100: 'rgb(0, 24, 77)',
  },
  
  // Gray Spectrum (Light Mode)
  gray: {
    0: 'rgb(255, 255, 255)',
    5: 'rgb(247, 248, 249)',
    10: 'rgb(238, 240, 243)',
    15: 'rgb(222, 225, 231)',
    20: 'rgb(206, 210, 219)',
    30: 'rgb(177, 183, 195)',
    40: 'rgb(137, 144, 158)',
    50: 'rgb(113, 120, 134)',
    60: 'rgb(91, 97, 110)',
    70: 'rgb(70, 75, 85)',
    80: 'rgb(50, 53, 61)',
    90: 'rgb(30, 32, 37)',
    100: 'rgb(10, 11, 13)',
  },
  
  // Green Spectrum
  green: {
    50: 'rgb(18, 153, 97)',
    60: 'rgb(9, 133, 81)',
  },
  
  // Dark Mode Blues
  blueDark: {
    60: 'rgb(55, 115, 245)',
    70: 'rgb(87, 139, 250)',
    80: 'rgb(132, 170, 253)',
  },
  
  // Dark Mode Grays
  grayDark: {
    0: 'rgb(10, 11, 13)',
    10: 'rgb(30, 32, 37)',
    20: 'rgb(50, 53, 61)',
    40: 'rgb(91, 97, 110)',
    50: 'rgb(114, 120, 134)',
    70: 'rgb(165, 170, 182)',
    90: 'rgb(224, 226, 231)',
    100: 'rgb(255, 255, 255)',
  },
} as const;

/**
 * Coinbase Typography
 * Using their standard font stack
 */
export const coinbaseFonts = {
  sans: "'Coinbase Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'Coinbase Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
} as const;

/**
 * Semantic Color Mappings (Light Mode)
 */
export const semanticColors = {
  background: {
    primary: coinbaseColors.gray[0],
    secondary: coinbaseColors.gray[5],
    tertiary: coinbaseColors.gray[10],
    inverse: coinbaseColors.gray[100],
  },
  foreground: {
    primary: coinbaseColors.gray[100],
    secondary: coinbaseColors.gray[60],
    tertiary: coinbaseColors.gray[40],
    inverse: coinbaseColors.gray[0],
  },
  border: {
    default: coinbaseColors.gray[15],
    strong: coinbaseColors.gray[30],
  },
  primary: {
    default: coinbaseColors.blue[60],
    hover: coinbaseColors.blue[70],
    pressed: coinbaseColors.blue[80],
    foreground: coinbaseColors.gray[0],
  },
  success: {
    default: coinbaseColors.green[60],
    foreground: coinbaseColors.gray[0],
  },
} as const;

/**
 * Semantic Color Mappings (Dark Mode)
 */
export const semanticColorsDark = {
  background: {
    primary: coinbaseColors.grayDark[0],
    secondary: coinbaseColors.grayDark[10],
    tertiary: coinbaseColors.grayDark[20],
    inverse: coinbaseColors.grayDark[100],
  },
  foreground: {
    primary: coinbaseColors.grayDark[100],
    secondary: coinbaseColors.grayDark[70],
    tertiary: coinbaseColors.grayDark[50],
    inverse: coinbaseColors.grayDark[0],
  },
  border: {
    default: coinbaseColors.grayDark[20],
    strong: coinbaseColors.grayDark[40],
  },
  primary: {
    default: coinbaseColors.blueDark[60],
    hover: coinbaseColors.blueDark[70],
    pressed: coinbaseColors.blueDark[80],
    foreground: coinbaseColors.grayDark[0],
  },
  success: {
    default: coinbaseColors.green[60],
    foreground: coinbaseColors.grayDark[0],
  },
} as const;
