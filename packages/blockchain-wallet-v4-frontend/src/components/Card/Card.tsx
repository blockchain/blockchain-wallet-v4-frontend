import { PaletteColors } from '@blockchain-com/constellation'
import styled, { css, CSSProperties } from 'styled-components'

import { CardBorderRadius, CardComponent, CardElevation, CardProps } from './types'

const mapCardBorderRadiusToRadius: Record<CardBorderRadius, CSSProperties['borderRadius']> = {
  lg: '0.75rem',
  md: '0.5rem'
}

const mapCardElevationToBoxShadow: Record<CardElevation, CSSProperties['boxShadow']> = {
  '1': '0px 3px 1px 0px #0000000a, 0px 3px 8px 0px #0000001f'
}

export const Card: CardComponent = styled.div<CardProps>`
  ${({ backgroundColor, borderRadius, borderWidth, elevation, theme }) => css`
    overflow: hidden;

    ${!!backgroundColor &&
    css`
      background-color: ${PaletteColors[backgroundColor]};
    `}

    ${!!elevation &&
    css`
      box-shadow: ${mapCardElevationToBoxShadow[elevation]};
    `}

    ${!!borderWidth &&
    css`
      border: ${borderWidth}px solid ${theme.grey100};
    `}

    ${!!borderRadius &&
    css`
      border-radius: ${mapCardBorderRadiusToRadius[borderRadius]};
    `}
  `}
`
