import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { Text } from 'blockchain-info-components'

import { statusConfig } from '../statusConfig'

interface IStatusBadgeOwnProps {
  bgColor: keyof DefaultTheme | string
}

interface IStatusBadgeProps {
  status: 'FAILED' | 'PENDING' | 'CONFIRMED'
}

type TBadgeProps = IStatusBadgeOwnProps & Partial<Text>

const Badge = styled(Text)<TBadgeProps>`
  background-color: ${(props) => props.theme[props.bgColor]};
  color: inherit;
  padding: 3px 8px;
  text-align: center;
  border-radius: 5px;
`

const StatusBadge: React.FC<IStatusBadgeProps> = ({ status }) => (
  <Badge bgColor={statusConfig[status].color} size='12px' lineHeight='18px' weight={600}>
    {statusConfig[status].text}
  </Badge>
)

export default StatusBadge
