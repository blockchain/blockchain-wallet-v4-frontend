import { injectGlobal } from 'styled-components'

import GillSansBoldEot from './assets/gillsans/GillSans-Bold.eot'
import GillSansBoldSvg from './assets/gillsans/GillSans-Bold.svg'
import GillSansBoldTtf from './assets/gillsans/GillSans-Bold.ttf'
import GillSansLightEot from './assets/gillsans/GillSans-Light.eot'
import GillSansLightSvg from './assets/gillsans/GillSans-Light.svg'
import GillSansLightTtf from './assets/gillsans/GillSans-Light.ttf'
import GillSansRegularEot from './assets/gillsans/GillSans-Regular.eot'
import GillSansRegularSvg from './assets/gillsans/GillSans-Regular.svg'
import GillSansRegularTtf from './assets/gillsans/GillSans-Regular.ttf'
import GillSansSemiBoldEot from './assets/gillsans/GillSans-SemiBold.eot'
import GillSansSemiBoldSvg from './assets/gillsans/GillSans-SemiBold.svg'
import GillSansSemiBoldTtf from './assets/gillsans/GillSans-SemiBold.ttf'
import GillSansUltraBoldEot from './assets/gillsans/GillSans-UltraBold.eot'
import GillSansUltraBoldSvg from './assets/gillsans/GillSans-UltraBold.svg'
import GillSansUltraBoldTtf from './assets/gillsans/GillSans-UltraBold.ttf'

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

const GillSansBold = FontFace('gillsans', GillSansBoldEot, GillSansBoldSvg, GillSansBoldTtf, '200')
const GillSansLight = FontFace('gillsans', GillSansLightEot, GillSansLightSvg, GillSansLightTtf, '400')
const GillSansRegular = FontFace('gillsans', GillSansRegularEot, GillSansRegularSvg, GillSansRegularTtf, '500')
const GillSansSemiBold = FontFace('gillsans', GillSansSemiBoldEot, GillSansSemiBoldSvg, GillSansSemiBoldTtf, '700')
const GillSansUltraBold = FontFace('gillsans', GillSansUltraBoldEot, GillSansUltraBoldSvg, GillSansUltraBoldTtf, '800')

// Fonts management
injectGlobal`
  ${GillSansBold}
  ${GillSansLight}
  ${GillSansRegular}
  ${GillSansSemiBold}
  ${GillSansUltraBold}
`
