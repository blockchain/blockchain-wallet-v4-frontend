import 'styled-components'
import Theme from 'blockchain-info-components/src/Colors/Default'

declare module 'styled-components' {
  type ITheme = typeof Theme
  export interface DefaultTheme extends ITheme {}
}
