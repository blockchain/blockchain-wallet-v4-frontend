import { complement } from 'polished'
import { DefaultTheme } from 'styled-components'
import { mapObjIndexed } from 'ramda'
import Default from './Default'

const Complement: DefaultTheme = mapObjIndexed(
  (num, key, obj) => complement(num),
  Default
)

export default Complement
