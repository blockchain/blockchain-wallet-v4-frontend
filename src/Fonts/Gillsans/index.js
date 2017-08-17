import { injectGlobal } from 'styled-components'

import GillSansBoldEot from './fonts/GillSans-Bold.eot'
import GillSansBoldSvg from './fonts/GillSans-Bold.svg'
import GillSansBoldTtf from './fonts/GillSans-Bold.ttf'
import GillSansLightEot from './fonts/GillSans-Light.eot'
import GillSansLightSvg from './fonts/GillSans-Light.svg'
import GillSansLightTtf from './fonts/GillSans-Light.ttf'
import GillSansRegularEot from './fonts/GillSans-Regular.eot'
import GillSansRegularSvg from './fonts/GillSans-Regular.svg'
import GillSansRegularTtf from './fonts/GillSans-Regular.ttf'
import GillSansSemiBoldEot from './fonts/GillSans-SemiBold.eot'
import GillSansSemiBoldSvg from './fonts/GillSans-SemiBold.svg'
import GillSansSemiBoldTtf from './fonts/GillSans-SemiBold.ttf'
import GillSansUltraBoldEot from './fonts/GillSans-UltraBold.eot'
import GillSansUltraBoldSvg from './fonts/GillSans-UltraBold.svg'
import GillSansUltraBoldTtf from './fonts/GillSans-UltraBold.ttf'

const FontFace = (name, eot, svg, ttf, weight) => `
  @font-face {
    font-family: '${name}';
    src: url(${eot});
    src: url('${eot}?#iefix') format('embedded-opentype'),
         url('${ttf}') format('truetype'),
         url('${svg}') format('svg');
    font-weight: ${weight};
    font-style: normal;
    font-stretch: normal;
  }
`

const GillSansLight = FontFace('gillsans', GillSansLightEot, GillSansLightSvg, GillSansLightTtf, '200')
const GillSansRegular = FontFace('gillsans', GillSansRegularEot, GillSansRegularSvg, GillSansRegularTtf, '400')
const GillSansSemiBold = FontFace('gillsans', GillSansSemiBoldEot, GillSansSemiBoldSvg, GillSansSemiBoldTtf, '500')
const GillSansBold = FontFace('gillsans', GillSansBoldEot, GillSansBoldSvg, GillSansBoldTtf, '700')
const GillSansUltraBold = FontFace('gillsans', GillSansUltraBoldEot, GillSansUltraBoldSvg, GillSansUltraBoldTtf, '800')

// Fonts management
injectGlobal`
  ${GillSansLight}
  ${GillSansRegular}
  ${GillSansSemiBold}
  ${GillSansBold}
  ${GillSansUltraBold}
`
