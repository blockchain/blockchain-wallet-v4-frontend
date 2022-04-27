import React from 'react'
import styled, { css } from 'styled-components'

import { BadgePlacementComponent, BadgePlacementProps } from './BadgePlacement.types'

const BadgeContainer = styled.div<{
  placement: BadgePlacementProps['placement']
  shape: BadgePlacementProps['shape']
}>`
  ${({ placement, shape }) => {
    const translateSize = shape === 'square' ? 50 : 33

    const baseStyle = css`
      position: absolute;
    `

    if (placement === 'end') {
      return css`
        ${baseStyle}

        top: 0;
        right: 0;
        transform: translate(${translateSize}%, -${translateSize}%);
        transform-origin: 100% 0%;
      `
    }

    if (placement === 'start') {
      return css`
        ${baseStyle}

        top: 0;
        left: 0;
        transform: translate(-${translateSize}%, -${translateSize}%);
      `
    }
  }}
`

export const BadgePlacement: BadgePlacementComponent = ({
  badge,
  children,
  placement = 'end',
  shape = 'square'
}) => {
  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {!!badge && (
        <BadgeContainer placement={placement} shape={shape}>
          {badge}
        </BadgeContainer>
      )}
      {children}
    </div>
  )
}
