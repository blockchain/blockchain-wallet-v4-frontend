import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { RoundedBadgeComponent, RoundedBadgeProps } from './RoundedBadge.types'

const Badge = styled.div<RoundedBadgeComponent>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16px;
  width: 32px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border-radius: 10px;
  color: white;
  font-size: 8px;
  text-transform: uppercase;
`

export const RoundedBadge = ({
  bgColor = PaletteColors['pink-600'],
  children
}: RoundedBadgeProps) => <Badge $backgroundColor={bgColor}>{children}</Badge>
