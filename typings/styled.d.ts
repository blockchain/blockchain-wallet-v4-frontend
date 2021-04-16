import Theme from 'blockchain-info-components/src/Colors/Default'

import 'styled-components'

declare module 'styled-components' {
  type ITheme = typeof Theme
  export interface DefaultTheme extends ITheme {}
}
