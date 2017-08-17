import { injectGlobal } from 'styled-components'

import MontserratBlackEot from './assets/montserrat/Montserrat-Black.eot'
import MontserratBlackSvg from './assets/montserrat/Montserrat-Black.svg'
import MontserratBlackTtf from './assets/montserrat/Montserrat-Black.ttf'
import MontserratBoldEot from './assets/montserrat/Montserrat-Bold.eot'
import MontserratBoldSvg from './assets/montserrat/Montserrat-Bold.svg'
import MontserratBoldTtf from './assets/montserrat/Montserrat-Bold.ttf'
import MontserratExtraBoldEot from './assets/montserrat/Montserrat-ExtraBold.eot'
import MontserratExtraBoldSvg from './assets/montserrat/Montserrat-ExtraBold.svg'
import MontserratExtraBoldTtf from './assets/montserrat/Montserrat-ExtraBold.ttf'
import MontserratExtraLightEot from './assets/montserrat/Montserrat-ExtraLight.eot'
import MontserratExtraLightSvg from './assets/montserrat/Montserrat-ExtraLight.svg'
import MontserratExtraLightTtf from './assets/montserrat/Montserrat-ExtraLight.ttf'
import MontserratLightEot from './assets/montserrat/Montserrat-Light.eot'
import MontserratLightSvg from './assets/montserrat/Montserrat-Light.svg'
import MontserratLightTtf from './assets/montserrat/Montserrat-Light.ttf'
import MontserratMediumEot from './assets/montserrat/Montserrat-Medium.eot'
import MontserratMediumSvg from './assets/montserrat/Montserrat-Medium.svg'
import MontserratMediumTtf from './assets/montserrat/Montserrat-Medium.ttf'
import MontserratRegularEot from './assets/montserrat/Montserrat-Regular.eot'
import MontserratRegularSvg from './assets/montserrat/Montserrat-Regular.svg'
import MontserratRegularTtf from './assets/montserrat/Montserrat-Regular.ttf'
import MontserratSemiBoldEot from './assets/montserrat/Montserrat-SemiBold.eot'
import MontserratSemiBoldSvg from './assets/montserrat/Montserrat-SemiBold.svg'
import MontserratSemiBoldTtf from './assets/montserrat/Montserrat-SemiBold.ttf'
import MontserratThinEot from './assets/montserrat/Montserrat-Thin.eot'
import MontserratThinSvg from './assets/montserrat/Montserrat-Thin.svg'
import MontserratThinTtf from './assets/montserrat/Montserrat-Thin.ttf'

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

const MontserratThin = FontFace('gillsans', MontserratThinEot, MontserratThinSvg, MontserratThinTtf, '100')
const MontserratExtraLight = FontFace('gillsans', MontserratExtraLightEot, MontserratExtraLightSvg, MontserratExtraLightTtf, '200')
const MontserratLight = FontFace('gillsans', MontserratLightEot, MontserratLightSvg, MontserratLightTtf, '300')
const MontserratMedium = FontFace('gillsans', MontserratMediumEot, MontserratMediumSvg, MontserratMediumTtf, '400')
const MontserratRegular = FontFace('gillsans', MontserratRegularEot, MontserratRegularSvg, MontserratRegularTtf, '500')
const MontserratSemiBold = FontFace('gillsans', MontserratSemiBoldEot, MontserratSemiBoldSvg, MontserratSemiBoldTtf, '600')
const MontserratExtraBold = FontFace('gillsans', MontserratExtraBoldEot, MontserratExtraBoldSvg, MontserratExtraBoldTtf, '800')
const MontserratBold = FontFace('gillsans', MontserratBoldEot, MontserratBoldSvg, MontserratBoldTtf, '700')
const MontserratBlack = FontFace('gillsans', MontserratBlackEot, MontserratBlackSvg, MontserratBlackTtf, '900')

// Fonts management
injectGlobal`
  ${MontserratThin}
  ${MontserratExtraLight}
  ${MontserratLight}
  ${MontserratMedium}
  ${MontserratRegular}
  ${MontserratSemiBold}
  ${MontserratExtraBold}
  ${MontserratBold}
  ${MontserratBlack}
`
