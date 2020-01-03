declare module 'blockchain-info-components' {
  import { DefaultTheme } from 'styled-components'
  // type-coverage:ignore-next-line
  export function Icon(...args: any): any
  // type-coverage:ignore-next-line
  export function Text(...args: any): any
  // type-coverage:ignore-next-line
  export function Button(...args: any): any
  // type-coverage:ignore-next-line
  export function Link(...args: any): any

  // type-coverage:ignore-next-line
  export function FontGlobalStyles(...args: any): any
  // type-coverage:ignore-next-line
  export function IconGlobalStyles(...args: any): any

  export function Palette(theme: string): DefaultTheme
}
