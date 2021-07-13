import { complement } from 'polished'
import { mapObjIndexed } from 'ramda'
import { DefaultTheme } from 'styled-components'

import Default from './Default'

const Complement: DefaultTheme = mapObjIndexed(num => complement(num), Default)

export default Complement
