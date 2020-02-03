import { StatelessComponent, CSSProperties } from 'react'
import { DefaultTheme } from 'styled-components'

export function BlockchainLoader(...args: any): any
export function Button(...args: any): any
export function FontGlobalStyles(...args: any): any
export function Icon(...args: any): any
export function IconGlobalStyles(...args: any): any
export function Image(...args: any): any
export function Link(...args: any): any
export function Modal(...args: any): any
export function ModalBody(...args: any): any
export function ModalHeader(...args: any): any
export function Palette(theme: string): DefaultTheme
export function SkeletonRectangle(...args: any): any
export function Table(...args): any
export function TableCell(...args): any
export function TableHeader(...args): any
export function TableRow(...args): any
export const Text: StatelessComponent<{
  color?: keyof DefaultTheme
  size?: string
  weight?: number
  style?: CSSProperties
  uppercase?: boolean
  lineHeight?: string
}>
export function TextGroup(...args: any): any
