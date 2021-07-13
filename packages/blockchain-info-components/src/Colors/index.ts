import { DefaultTheme } from 'styled-components'

import Complement from './Complement'
import DarkMode from './DarkMode'
import Default from './Default'
import Grayscale from './Grayscale'
import Invert from './Invert'

const Color = (color: string, theme: string) => {
  switch (theme) {
    case 'default':
      return Default[color]
    case 'complement':
      return Complement[color]
    case 'grayscale':
      return Grayscale[color]
    case 'invert':
      return Invert[color]
    case 'darkmode':
      return DarkMode[color]

    default:
      return Default[color]
  }
}

const Palette = (theme: string): DefaultTheme => {
  switch (theme) {
    case 'default':
      return Default
    case 'complement':
      return Complement
    case 'grayscale':
      return Grayscale
    case 'invert':
      return Invert
    case 'darkmode':
      return DarkMode
    default:
      return Default
  }
}

export { Color, Palette }
