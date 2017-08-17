import { injectGlobal } from 'styled-components'

import IcomoonEot from './assets/icomoon/icomoon.eot'
import IcomoonSvg from './assets/icomoon/icomoon.svg'
import IcomoonTtf from './assets/icomoon/icomoon.ttf'

const FontFace = (name, eot, ttf, svg, weight) => `
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

const Icomoon = FontFace('icomoon', IcomoonEot, IcomoonTtf, IcomoonSvg, 'normal')

// Fonts management
injectGlobal`
  ${Icomoon}
`
