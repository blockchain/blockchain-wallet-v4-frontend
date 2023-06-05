import { DefaultTheme } from 'styled-components'

export type HeaderProps = {
  date: Date
  onClickBack: () => void
  theme: DefaultTheme
  totalMs: number
}
