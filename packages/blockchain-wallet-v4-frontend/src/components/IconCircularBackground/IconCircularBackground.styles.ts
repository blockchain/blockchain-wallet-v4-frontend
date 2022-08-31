import { PaletteColors } from '@blockchain-com/constellation'
import styled, { css } from 'styled-components'

import {
  IconCircularBackgroundColor,
  IconCircularBackgroundSizes
} from './IconCircularBackground.types'

const sizeToPixels: Record<IconCircularBackgroundSizes, number> = {
  default: 24,
  large: 32
}

export const Container = styled.div<{ size: IconCircularBackgroundSizes | number }>`
  ${({ size }) => css`
    height: ${sizeToPixels[size] ?? size}px;
    position: relative;
    width: ${sizeToPixels[size] ?? size}px;
  `}
`

export const CircularBackground = styled.div<{
  backgroundOpacity: number
  color: IconCircularBackgroundColor
  size: IconCircularBackgroundSizes | number
}>`
  ${({ backgroundOpacity, color, size }) => css`
    background-color: ${PaletteColors[color] ?? color};
    border-radius: 50%;
    height: ${sizeToPixels[size] ?? size}px;
    opacity: ${backgroundOpacity};
    position: absolute;
    width: ${sizeToPixels[size] ?? size}px;
  `}
`

export const ContentContainer = styled.div<{ size: IconCircularBackgroundSizes | number }>`
  ${({ size }) => css`
    align-items: center;
    display: flex;
    height: ${sizeToPixels[size] ?? size}px;
    justify-content: center;
    position: absolute;
    width: ${sizeToPixels[size] ?? size}px;
  `}
`
