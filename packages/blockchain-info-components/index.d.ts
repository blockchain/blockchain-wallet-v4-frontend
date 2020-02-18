import {
  StatelessComponent,
  PureComponent,
  CSSProperties,
  ComponentElement
} from 'react'
import { DefaultTheme } from 'styled-components'
import { IcoMoonType } from './src/Icons/Icomoon'
import { ImageType } from './src/Images/Images'

export const BlockchainLoader: StatelessComponent<{
  width?: string
  height?: string
}>
export const Button: StatelessComponent<
  {
    'data-e2e': string
    nature?:
      | 'copy'
      | 'dark'
      | 'dark-grey'
      | 'empty-secondary'
      | 'empty'
      | 'gray-3'
      | 'green'
      | 'light'
      | 'primary'
      | 'purple'
      | 'received'
      | 'secondary'
      | 'sent'
      | 'success'
      | 'transferred'
      | 'warning'
      | 'white-transparent'
    fullwidth?: boolean
    disabled?: boolean
    rounded?: boolean
    bold?: boolean
    small?: boolean
    uppercase?: boolean
    capitalize?: boolean
    width?: string
    padding?: string
    margin?: string
    jumbo?: boolean
    height?: string
    className?: string
    onClick?: () => void
    style?: CSSProperties
  } & React.ButtonHTMLAttributes<{}>
>

export const ComponentDropdown: React.ComponentClass<{
  components: Array<JSX.Element>
  color?: string
  toggleOnClassback?: boolean
  opened?: boolean
  uppercase?: boolean
  down?: boolean
  forceSelected?: boolean
  selectedComponent?: JSX.Element
  onClick?: () => void
  callback?: () => void
}>

export const FontGlobalStyles: StatelessComponent<{}>
export const HeartbeatLoader: StatelessComponent<{
  width?: string
  height?: string
  color?: keyof DefaultTheme
}>
export const Icon: StatelessComponent<{
  name: keyof IcoMoonType
  weight?: number
  size?: string
  cursor?: boolean
  color?: string
  style?: CSSProperties
  onClick?: () => void
}>
export const IconGlobalStyles: StatelessComponent<{}>
export const Image: StatelessComponent<{
  name: keyof ImageType
  width?: string
  height?: string
  color?: string
  size?: string
}>
export const Link: StatelessComponent<{
  weight?: number
  size?: string
  color?: keyof DefaultTheme
  uppercase?: boolean
  capitalize?: boolean
  bold?: boolean
  href?: string
  target?: string
  rel?: string
  style?: CSSProperties
  onClick?: () => void
}>
export const Modal: StatelessComponent<{
  size?: '' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'
  type?: 'tray' | 'flyout'
  position?: number
  total?: number
  width?: number
  isLast?: boolean
  dataE2e?: string
  style?: CSSProperties
}>
export const ModalBody: StatelessComponent<{
  loading?: boolean
}>
export const ModalHeader: StatelessComponent<{
  closeButton?: boolean
  onClose?: () => void
  icon?: keyof IcoMoonType
}>
export function Palette(theme: string): DefaultTheme
export const SkeletonRectangle: StatelessComponent<{
  width?: string
  height?: string
  bgColor?: keyof DefaultTheme
}>
export const SpinningLoader: StatelessComponent<{
  width?: string
  height?: string
}>
export const Table: StatelessComponent<{
  style?: CSSProperties
}>
export const TableCell: StatelessComponent<{
  onClick?: () => void
  width?: string
  hideMobile?: boolean
}>
export const TableHeader: StatelessComponent<{}>
export const TableRow: StatelessComponent<{}>
export const Text: StatelessComponent<{
  color?: keyof DefaultTheme
  size?: string
  weight?: number
  style?: CSSProperties
  uppercase?: boolean
  lineHeight?: string
  capitazlie?: boolean
  italic?: boolean
  altFont?: boolean
  cursor?: string
  opacity?: string
  onClick?: () => void
}>
export const TextGroup: StatelessComponent<{
  nowrap?: boolean
  inline?: boolean
  style?: CSSProperties
}>
export const TooltipHost: StatelessComponent<{ id: string }>
export const TooltipIcon: StatelessComponent<{
  name: keyof IcoMoonType
  size?: string
}>
