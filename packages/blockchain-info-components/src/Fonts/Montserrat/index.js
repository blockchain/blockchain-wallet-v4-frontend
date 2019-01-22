import { createGlobalStyle } from 'styled-components'

import MontserratBlackEot from './fonts/Montserrat-Black.eot'
import MontserratBlackSvg from './fonts/Montserrat-Black.svg'
import MontserratBlackTtf from './fonts/Montserrat-Black.ttf'
import MontserratBoldEot from './fonts/Montserrat-Bold.eot'
import MontserratBoldSvg from './fonts/Montserrat-Bold.svg'
import MontserratBoldTtf from './fonts/Montserrat-Bold.ttf'
import MontserratExtraBoldEot from './fonts/Montserrat-ExtraBold.eot'
import MontserratExtraBoldSvg from './fonts/Montserrat-ExtraBold.svg'
import MontserratExtraBoldTtf from './fonts/Montserrat-ExtraBold.ttf'
import MontserratExtraLightEot from './fonts/Montserrat-ExtraLight.eot'
import MontserratExtraLightSvg from './fonts/Montserrat-ExtraLight.svg'
import MontserratExtraLightTtf from './fonts/Montserrat-ExtraLight.ttf'
import MontserratLightEot from './fonts/Montserrat-Light.eot'
import MontserratLightSvg from './fonts/Montserrat-Light.svg'
import MontserratLightTtf from './fonts/Montserrat-Light.ttf'
import MontserratMediumEot from './fonts/Montserrat-Medium.eot'
import MontserratMediumSvg from './fonts/Montserrat-Medium.svg'
import MontserratMediumTtf from './fonts/Montserrat-Medium.ttf'
import MontserratRegularEot from './fonts/Montserrat-Regular.eot'
import MontserratRegularSvg from './fonts/Montserrat-Regular.svg'
import MontserratRegularTtf from './fonts/Montserrat-Regular.ttf'
import MontserratSemiBoldEot from './fonts/Montserrat-SemiBold.eot'
import MontserratSemiBoldSvg from './fonts/Montserrat-SemiBold.svg'
import MontserratSemiBoldTtf from './fonts/Montserrat-SemiBold.ttf'
import MontserratThinEot from './fonts/Montserrat-Thin.eot'
import MontserratThinSvg from './fonts/Montserrat-Thin.svg'
import MontserratThinTtf from './fonts/Montserrat-Thin.ttf'

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

const MontserratThin = FontFace(
  'Montserrat',
  MontserratThinEot,
  MontserratThinSvg,
  MontserratThinTtf,
  '100'
)
const MontserratExtraLight = FontFace(
  'Montserrat',
  MontserratExtraLightEot,
  MontserratExtraLightSvg,
  MontserratExtraLightTtf,
  '200'
)
const MontserratLight = FontFace(
  'Montserrat',
  MontserratLightEot,
  MontserratLightSvg,
  MontserratLightTtf,
  '300'
)
const MontserratRegular = FontFace(
  'Montserrat',
  MontserratRegularEot,
  MontserratRegularSvg,
  MontserratRegularTtf,
  '400'
)
const MontserratMedium = FontFace(
  'Montserrat',
  MontserratMediumEot,
  MontserratMediumSvg,
  MontserratMediumTtf,
  '500'
)
const MontserratSemiBold = FontFace(
  'Montserrat',
  MontserratSemiBoldEot,
  MontserratSemiBoldSvg,
  MontserratSemiBoldTtf,
  '600'
)
const MontserratExtraBold = FontFace(
  'Montserrat',
  MontserratExtraBoldEot,
  MontserratExtraBoldSvg,
  MontserratExtraBoldTtf,
  '800'
)
const MontserratBold = FontFace(
  'Montserrat',
  MontserratBoldEot,
  MontserratBoldSvg,
  MontserratBoldTtf,
  '700'
)
const MontserratBlack = FontFace(
  'Montserrat',
  MontserratBlackEot,
  MontserratBlackSvg,
  MontserratBlackTtf,
  '900'
)

export const FontGlobalStyles = createGlobalStyle`
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
