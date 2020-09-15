import { DefaultTheme } from 'styled-components'
import { invert } from 'polished'
import { mapObjIndexed } from 'ramda'
import Default from './Default'

const Invert: DefaultTheme = mapObjIndexed(num => invert(num), Default)

export default Invert
