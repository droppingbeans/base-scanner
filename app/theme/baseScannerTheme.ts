import { type ThemeConfig } from '@coinbase/cds-web/system';
import { defaultTheme } from '@coinbase/cds-web/themes/defaultTheme';

/**
 * Base Scanner Custom Theme
 * Using exact color palette from user requirements
 */
export const baseScannerTheme: ThemeConfig = {
  ...defaultTheme,
  id: 'base-scanner',
  
  // Dark Mode Spectrum (primary)
  darkSpectrum: {
    // Blues - User's exact palette
    blue0: '0, 16, 51',
    blue5: '1, 29, 91',
    blue10: '1, 42, 130',
    blue15: '3, 51, 154',
    blue20: '5, 59, 177',
    blue30: '10, 72, 206',
    blue40: '19, 84, 225',
    blue50: '33, 98, 238',
    blue60: '0, 82, 255',      // Coinbase Blue
    blue70: '60, 138, 255',    // User's Cerulean
    blue80: '132, 170, 253',
    blue90: '185, 207, 255',
    blue100: '245, 248, 255',
    
    // Grays - User's exact palette
    gray0: '10, 11, 13',        // User's Gray 100
    gray5: '20, 21, 25',
    gray10: '30, 32, 37',
    gray15: '40, 43, 49',
    gray20: '50, 53, 61',       // User's Gray 80
    gray30: '70, 75, 85',
    gray40: '91, 97, 110',      // User's Gray 60
    gray50: '113, 120, 134',    // User's Gray 50
    gray60: '138, 145, 158',
    gray70: '165, 170, 182',
    gray80: '193, 198, 207',
    gray90: '224, 226, 231',
    gray100: '255, 255, 255',   // User's Gray 0
    
    // Keep other colors from defaultTheme
    green0: '0, 31, 18',
    green5: '0, 48, 29',
    green10: '1, 70, 42',
    green15: '2, 82, 48',
    green20: '2, 92, 55',
    green30: '6, 112, 68',
    green40: '11, 133, 82',
    green50: '21, 153, 98',
    green60: '39, 173, 117',
    green70: '68, 194, 141',
    green80: '111, 214, 171',
    green90: '171, 235, 208',
    green100: '245, 255, 251',
    
    orange0: '51, 13, 0',
    orange5: '79, 20, 0',
    orange10: '107, 28, 1',
    orange15: '131, 36, 2',
    orange20: '155, 44, 4',
    orange30: '189, 59, 9',
    orange40: '213, 76, 18',
    orange50: '230, 96, 32',
    orange60: '240, 120, 54',
    orange70: '248, 150, 86',
    orange80: '252, 185, 131',
    orange90: '254, 219, 185',
    orange100: '255, 250, 245',
    
    indigo0: '8, 15, 51',
    indigo5: '14, 27, 91',
    indigo10: '21, 39, 130',
    indigo15: '27, 47, 154',
    indigo20: '33, 56, 177',
    indigo30: '48, 73, 206',
    indigo40: '68, 92, 225',
    indigo50: '92, 113, 238',
    indigo60: '121, 138, 245',
    indigo70: '153, 165, 250',
    indigo80: '187, 194, 253',
    indigo90: '219, 223, 255',
    indigo100: '246, 247, 255',
    
    pink0: '51, 10, 44',
    pink5: '70, 14, 61',
    pink10: '89, 19, 78',
    pink15: '108, 24, 94',
    pink20: '126, 30, 111',
    pink30: '159, 44, 142',
    pink40: '187, 64, 170',
    pink50: '208, 88, 193',
    pink60: '225, 117, 214',
    pink70: '237, 149, 230',
    pink80: '246, 184, 243',
    pink90: '252, 217, 251',
    pink100: '255, 245, 255',
    
    purple0: '25, 13, 51',
    purple5: '43, 22, 89',
    purple10: '73, 30, 137',
    purple15: '97, 37, 175',
    purple20: '123, 45, 211',
    purple30: '142, 51, 234',
    purple40: '164, 84, 244',
    purple50: '188, 123, 251',
    purple60: '205, 153, 253',
    purple70: '217, 176, 254',
    purple80: '230, 201, 255',
    purple90: '237, 217, 255',
    purple100: '251, 247, 255',
    
    red0: '51, 0, 4',
    red5: '79, 0, 7',
    red10: '107, 1, 10',
    red15: '131, 4, 14',
    red20: '155, 7, 19',
    red30: '189, 19, 33',
    red40: '213, 38, 52',
    red50: '230, 64, 78',
    red60: '240, 90, 104',
    red70: '248, 123, 136',
    red80: '252, 162, 173',
    red90: '254, 203, 211',
    red100: '255, 245, 246',
    
    teal0: '0, 27, 51',
    teal5: '0, 42, 79',
    teal10: '0, 56, 107',
    teal15: '0, 68, 131',
    teal20: '0, 79, 155',
    teal30: '0, 102, 189',
    teal40: '0, 127, 213',
    teal50: '0, 147, 203',
    teal60: '0, 123, 179',
    teal70: '0, 97, 149',
    teal80: '0, 71, 116',
    teal90: '0, 47, 83',
    teal100: '240, 254, 255',
    
    yellow0: '27, 6, 0',
    yellow5: '48, 12, 0',
    yellow10: '70, 19, 0',
    yellow15: '92, 26, 0',
    yellow20: '114, 34, 0',
    yellow30: '152, 52, 0',
    yellow40: '186, 76, 0',
    yellow50: '207, 103, 0',
    yellow60: '219, 135, 0',
    yellow70: '228, 172, 0',
    yellow80: '237, 211, 26',
    yellow90: '247, 236, 145',
    yellow100: '255, 252, 241',
    
    chartreuse0: '7, 26, 17',
    chartreuse5: '12, 43, 28',
    chartreuse10: '17, 64, 35',
    chartreuse15: '20, 77, 39',
    chartreuse20: '25, 93, 41',
    chartreuse30: '35, 122, 43',
    chartreuse40: '53, 151, 48',
    chartreuse50: '86, 179, 64',
    chartreuse60: '127, 208, 87',
    chartreuse70: '137, 223, 117',
    chartreuse80: '159, 238, 155',
    chartreuse90: '198, 247, 209',
    chartreuse100: '245, 255, 250',
  } as const,
  
  // Light Mode Spectrum (fallback - we're using dark mode primarily)
  lightSpectrum: defaultTheme.lightSpectrum,
};
