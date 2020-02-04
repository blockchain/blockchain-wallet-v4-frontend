import { StatelessComponent, CSSProperties } from 'react'
import { DefaultTheme } from 'styled-components'
import { IcoMoonType } from './src/Icons/Icomoon'
import { ImageType } from './src/Images/Images'

//Blockchain Loader is done
export const BlockchainLoader: StatelessComponent<{
  width?: string
  height?: string
}>
//Button is done
export const Button: StatelessComponent<{
  nature?:
    | 'copy'
    | 'dark'
    | 'empty-secondary'
    | 'empty'
    | 'gray-3'
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
}>
//Done
export const FontGlobalStyles: StatelessComponent<{}>
//done
export const Icon: StatelessComponent<{
  name?: keyof IcoMoonType
  weight?: number
  size?: string
  curson?: boolean
}>
//done
export const IconGlobalStyles: StatelessComponent<{}>
//done
export const Image: StatelessComponent<{
  name?: keyof ImageType
  width?: string
  height?: string
  color?: string
}>
//done
export const Link: StatelessComponent<{
  weight?: number
  size?: string
  color?: keyof DefaultTheme
  uppercase?: boolean
  capitalize: boolean
  bold?: boolean
}>

export const Modal: StatelessComponent<{
  size?: '' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'
  position?: number
  total?: number
  width?: number
  isLast?: boolean
}>
export const ModalBody: StatelessComponent<{
  loading?: boolean
}>
export const ModalHeader: StatelessComponent<{
  closeButton?: boolean
  //this is supposed to be a function
  onClose?: any
  icon?: keyof IcoMoonType
}>
export function Palette(theme: string): DefaultTheme
export const SkeletonRectangle: StatelessComponent<{
  width: string
  height: string
  bgColor: keyof DefaultTheme
}>
export const Table: StatelessComponent<{}>
export const TableCell: StatelessComponent<{
  width: string
  hideMobile: boolean
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
  //display - flexrow or block?
  //font family
  // cursor
}>
export const TextGroup: StatelessComponent<{
  nowrap: boolean
  inline: boolean
}>
