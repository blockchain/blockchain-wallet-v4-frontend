import { injectGlobal } from 'styled-components'

import IcomoonEot from './fonts/icomoon.eot'
import IcomoonSvg from './fonts/icomoon.svg'
import IcomoonTtf from './fonts/icomoon.ttf'

const removeSlashes = (path) => path.replace(/^\/|\/$/g, '')

const FontFace = (name, eot, svg, ttf, weight) => {
  return (`
    @font-face {
      font-family: '${name}';
      src: url(${removeSlashes(eot)});
      src: url('${removeSlashes(eot)}?#iefix') format('embedded-opentype'),
          url('${removeSlashes(ttf)}') format('truetype'),
          url('${removeSlashes(svg)}') format('svg');
      font-weight: ${weight};
      font-style: normal;
      font-stretch: normal;
    }
  `)
}

const Icomoon = FontFace('icomoon', IcomoonEot, IcomoonSvg, IcomoonTtf, 'normal')

// Fonts management
injectGlobal`
  ${Icomoon}
`
