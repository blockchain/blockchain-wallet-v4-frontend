import { DefaultTheme } from 'styled-components'

export type HeaderProps = {
  onClickBack: () => void
  percentage: number
  theme: DefaultTheme
  timer: string
}
