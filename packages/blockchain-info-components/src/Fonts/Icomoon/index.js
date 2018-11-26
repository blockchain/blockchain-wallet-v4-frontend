import { createGlobalStyle } from 'styled-components'

import IcomoonEot from './fonts/icomoon.eot'
import IcomoonSvg from './fonts/icomoon.svg'
import IcomoonTtf from './fonts/icomoon.ttf'

const FontFace = (name, eot, svg, ttf, weight) => {
  return `
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
}

const Icomoon = FontFace(
  'icomoon',
  IcomoonEot,
  IcomoonSvg,
  IcomoonTtf,
  'normal'
)

export const IconGlobalStyles = createGlobalStyle`
  ${Icomoon}
`
