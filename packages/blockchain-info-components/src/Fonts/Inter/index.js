import { createGlobalStyle } from 'styled-components'

import InterBlackWoff2 from './fonts/Inter-Black.woff2'
import InterBlackItalicWoff2 from './fonts/Inter-BlackItalic.woff2'
import InterBoldWoff2 from './fonts/Inter-Bold.woff2'
import InterExtraBoldWoff2 from './fonts/Inter-ExtraBold.woff2'
import InterExtraLightWoff2 from './fonts/Inter-ExtraLight.woff2'
import InterLightWoff2 from './fonts/Inter-Light.woff2'
import InterMediumWoff2 from './fonts/Inter-Medium.woff2'
import InterRegularWoff2 from './fonts/Inter-Regular.woff2'
import InterSemiBoldWoff2 from './fonts/Inter-SemiBold.woff2'
import InterThinWoff2 from './fonts/Inter-Thin.woff2'

const FontFace = (name, woff2, weight) => `
  @font-face {
    font-family: '${name}';
    src: url('${woff2}') format('woff2');
    font-weight: ${weight};
    font-style: normal;
    font-stretch: normal;
  }
`

const InterThin = FontFace('Inter', InterThinWoff2, '100')
const InterExtraLight = FontFace('Inter', InterExtraLightWoff2, '200')
const InterLight = FontFace('Inter', InterLightWoff2, '300')
const InterRegular = FontFace('Inter', InterRegularWoff2, '400')
const InterMedium = FontFace('Inter', InterMediumWoff2, '500')
const InterSemiBold = FontFace('Inter', InterSemiBoldWoff2, '600')
const InterExtraBold = FontFace('Inter', InterExtraBoldWoff2, '800')
const InterBold = FontFace('Inter', InterBoldWoff2, '700')
const InterBlack = FontFace('Inter', InterBlackWoff2, '900')
const InterBlackItalic = FontFace('Inter', InterBlackItalicWoff2, '900')

export const FontGlobalStyles = createGlobalStyle`
  ${InterThin}
  ${InterExtraLight}
  ${InterLight}
  ${InterMedium}
  ${InterRegular}
  ${InterSemiBold}
  ${InterExtraBold}
  ${InterBold}
  ${InterBlack}
  ${InterBlackItalic}
`
