import { DefaultTheme } from 'styled-components'
import { grayscale } from 'polished'
import { mapObjIndexed } from 'ramda'
import Default from './Default'

const Grayscale: DefaultTheme = mapObjIndexed(num => grayscale(num), Default)

export default Grayscale
