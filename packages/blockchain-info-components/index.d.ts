import {
  ButtonHTMLAttributes,
  ComponentClass,
  CSSProperties,
  FunctionComponent,
  ReactNode
} from 'react'
import { DefaultTheme } from 'styled-components'
import { IcoMoonType } from './src/Icons/Icomoon'
import { ImageType } from './src/Images/Images'
import { CoinType, WalletCurrencyType } from 'core/types'
import { SwapBaseCounterTypes } from 'data/types'

type AllCoinsType = WalletCurrencyType | 'BSV' | 'STX'

export const Badge: FunctionComponent<any>
export const Banner: FunctionComponent<any>
export const BlockchainLoader: FunctionComponent<{
  width?: string
  height?: string
}>
export const Button: FunctionComponent<
  {
    'data-e2e': string
    nature?:
      | 'copy'
      | 'dark'
      | 'dark-grey'
      | 'empty-secondary'
      | 'empty'
      | 'empty-blue'
      | 'grey400'
      | 'green'
      | 'grey800'
      | 'light'
      | 'light-red'
      | 'primary'
      | 'purple'
      | 'received'
      | 'secondary'
      | 'sent'
      | 'success'
      | 'transferred'
      | 'warning'
      | 'white-blue'
      | 'white-transparent'
    bold?: boolean
    capitalize?: boolean
    className?: string
    disabled?: boolean
    fullwidth?: boolean
    height?: string
    jumbo?: boolean
    margin?: string
    onClick?: () => void
    padding?: string
    rounded?: boolean
    size?: string
    small?: boolean
    style?: CSSProperties
    uppercase?: boolean
    width?: string
  } & ButtonHTMLAttributes<{}>
>
export const Carousel: FunctionComponent<{
  height: number
  arrows: boolean
  chips: boolean
}>
export const ComponentDropdown: ComponentClass<{
  callback?: () => void
  color?: string
  components: Array<JSX.Element | boolean>
  down?: boolean
  forceSelected?: boolean
  opened?: boolean
  onClick?: () => void
  margin?: string
  selectedComponent?: JSX.Element
  textAlign?: string
  toggleOnCallback?: boolean
  uppercase?: boolean
  width?: string
}>

export function Color(color: keyof DefaultTheme): DefaultTheme[keyof DefaultTheme]

export const FontGlobalStyles: FunctionComponent<{}>
export const FlatLoader: FunctionComponent<{
  width?: string
  height?: string
  style?: CSSProperties
}>
export const HeartbeatLoader: FunctionComponent<{
  width?: string
  height?: string
  color?: keyof DefaultTheme
}>
export const Icon: FunctionComponent<{
  className?: string
  name: keyof IcoMoonType | AllCoinsType
  weight?: number
  size?: string
  cursor?: boolean
  color?: keyof DefaultTheme
  style?: CSSProperties
  onClick?: () => void
  role?: 'button'
}>
export const CoinAccountIcon: FunctionComponent<{
  accountType: SwapBaseCounterTypes | 'EXCHANGE' | 'INTEREST'
  coin: AllCoinsType
  style?: CSSProperties
}>
export const IconButton: FunctionComponent<
  {
    'data-e2e': string
    nature?:
      | 'copy'
      | 'dark'
      | 'dark-grey'
      | 'empty-secondary'
      | 'empty'
      | 'grey400'
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
      | 'white-blue'
      | 'white-transparent'
    bold?: boolean
    capitalize?: boolean
    className?: string
    disabled?: boolean
    fullwidth?: boolean
    height?: string
    jumbo?: boolean
    margin?: string
    name: keyof IcoMoonType | AllCoinsType
    onClick?: () => void
    padding?: string
    rounded?: boolean
    small?: boolean
    style?: CSSProperties
    uppercase?: boolean
    width?: string
  } & ButtonHTMLAttributes<{}>
>
export const IconGlobalStyles: FunctionComponent<{}>
export const Image: FunctionComponent<{
  name: keyof ImageType
  srcset?: {
    [key in keyof ImageType]?: '1x' | '2x' | '3x'
  }
  width?: string
  height?: string
  color?: string
  size?: string
  style?: CSSProperties
}>
export const Link: FunctionComponent<{
  altFont?: boolean
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
  onClick?: (e?: KeyboardEvent) => void
}>
export const Modal: FunctionComponent<{
  children: ReactNode
  size?: '' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'
  type?: 'tray' | 'flyout'
  position?: number
  total?: number
  width?: number
  isLast?: boolean
  dataE2e?: string
  style?: CSSProperties
}>
export const ModalBody: FunctionComponent<{
  loading?: boolean
}>
export const ModalHeader: FunctionComponent<{
  closeButton?: boolean
  onClose?: () => void
  icon?: keyof IcoMoonType | AllCoinsType
}>
export const ModalFooter: FunctionComponent<{
  align: 'left' | 'right' | 'center' | 'spaced'
}>
export function Palette(theme: string): DefaultTheme
export const Separator: FunctionComponent<{}>
export const SkeletonCircle: FunctionComponent<{
  width?: string
  height?: string
  bgColor?: keyof DefaultTheme
}>
export const SkeletonRectangle: FunctionComponent<{
  width?: string
  height?: string
  bgColor?: keyof DefaultTheme
}>
export const SpinningLoader: FunctionComponent<{
  width?: string
  height?: string
  borderWidth?: string
}>
export const TabMenu: FunctionComponent<{}>
export const TabMenuItem: FunctionComponent<{
  activeClassName?: string
  role?: string
  disabled?: boolean
  onClick?: () => void
  selected?: boolean
  width?: string
}>
export const Table: FunctionComponent<{
  style?: CSSProperties
}>
export const TableCell: FunctionComponent<{
  onClick?: () => void
  width?: string
  hideMobile?: boolean
  style?: CSSProperties
}>
export const TableHeader: FunctionComponent<{}>
export const TableRow: FunctionComponent<{}>
export const Text: FunctionComponent<{
  color?: keyof DefaultTheme
  size?: string
  weight?: number
  style?: CSSProperties
  uppercase?: boolean
  lineHeight?: string
  capitalize?: boolean
  italic?: boolean
  altFont?: boolean
  cursor?: string
  opacity?: string
  onClick?: () => void
}>
export const TextGroup: FunctionComponent<{
  nowrap?: boolean
  inline?: boolean
  style?: CSSProperties
}>
export const Toast: FunctionComponent<{
  nature?: 'success' | 'error' | 'warn'
  coin?: CoinType
  onClose?: () => void
  persist?: boolean
  timeout?: number
}>
export const Tooltip: FunctionComponent<{ id: string; offset?: any }>
export const TooltipHost: FunctionComponent<{ id: string }>
export const TooltipIcon: FunctionComponent<{
  color?: keyof DefaultTheme
  name: keyof IcoMoonType | AllCoinsType
  size?: string
}>
export const CheckBoxInput: FunctionComponent<{
  name: string
  checked?: boolean
  disabled?: boolean
  onClick?: () => void
  onChange?: () => void
}>
