import { createGlobalStyle } from 'styled-components'

import InterBlackOtf from './fonts/Inter-Black.otf'
import InterBlackTtf from './fonts/Inter-Black.ttf'
import InterBlackItalicOtf from './fonts/Inter-BlackItalic.otf'
import InterBlackItalicTtf from './fonts/Inter-BlackItalic.ttf'
import InterBoldOtf from './fonts/Inter-Bold.otf'
import InterBoldTtf from './fonts/Inter-Bold.ttf'
import InterExtraBoldOtf from './fonts/Inter-ExtraBold.otf'
import InterExtraBoldTtf from './fonts/Inter-ExtraBold.ttf'
import InterExtraLightOtf from './fonts/Inter-ExtraLight-BETA.otf'
import InterExtraLightTtf from './fonts/Inter-ExtraLight-BETA.ttf'
import InterLightOtf from './fonts/Inter-Light-BETA.otf'
import InterLightTtf from './fonts/Inter-Light-BETA.ttf'
import InterMediumOtf from './fonts/Inter-Medium.otf'
import InterMediumTtf from './fonts/Inter-Medium.ttf'
import InterRegularOtf from './fonts/Inter-Regular.otf'
import InterRegularTtf from './fonts/Inter-Regular.ttf'
import InterSemiBoldOtf from './fonts/Inter-SemiBold.otf'
import InterSemiBoldTtf from './fonts/Inter-SemiBold.ttf'
import InterThinOtf from './fonts/Inter-Thin-BETA.otf'
import InterThinTtf from './fonts/Inter-Thin-BETA.ttf'

const FontFace = (name, otf, ttf, weight) => `
  @font-face {
    font-family: '${name}';
    src: url('${otf}'),
      url('${ttf}') format('truetype');
    font-weight: ${weight};
    font-style: normal;
    font-stretch: normal;
  }
`

const InterThin = FontFace('Inter', InterThinOtf, InterThinTtf, '100')
const InterExtraLight = FontFace(
  'Inter',
  InterExtraLightOtf,
  InterExtraLightTtf,
  '200'
)
const InterLight = FontFace('Inter', InterLightOtf, InterLightTtf, '300')
const InterRegular = FontFace('Inter', InterRegularOtf, InterRegularTtf, '400')
const InterMedium = FontFace('Inter', InterMediumOtf, InterMediumTtf, '500')
const InterSemiBold = FontFace(
  'Inter',
  InterSemiBoldOtf,
  InterSemiBoldTtf,
  '600'
)
const InterExtraBold = FontFace(
  'Inter',
  InterExtraBoldOtf,
  InterExtraBoldTtf,
  '800'
)
const InterBold = FontFace('Inter', InterBoldOtf, InterBoldTtf, '700')
const InterBlack = FontFace('Inter', InterBlackOtf, InterBlackTtf, '900')
const InterBlackItalic = FontFace(
  'Inter',
  InterBlackItalicOtf,
  InterBlackItalicTtf,
  '900'
)

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
