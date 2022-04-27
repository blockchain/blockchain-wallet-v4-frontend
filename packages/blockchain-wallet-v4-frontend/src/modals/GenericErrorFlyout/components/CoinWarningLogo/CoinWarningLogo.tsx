import React from 'react'
import { IconAlert } from '@blockchain-com/icons'
import { useRecord } from 'hooks'
import styled, { css } from 'styled-components'

import { Icon as LegacyIcon } from 'blockchain-info-components'
import { BadgePlacement, IconBadge } from 'components/Badge'
import { Flex } from 'components/Flex'

import { CoinWarningLogoComponent } from './CoinWarningLogo.types'

const SeverityIconContainer = styled.div<{ size: number }>`
  ${({ size, theme }) => css`
    height: ${size}px;
    width: ${size}px;
    font-size: ${size}px;
    color: ${theme.orange600};
  `}
`

export const CoinWarningLogo: CoinWarningLogoComponent = ({
  coin,
  coinIconSize = 72,
  severity = 'warning',
  severityIconSize = 32
}) => {
  const coinIcon = <LegacyIcon name={coin} size={`${coinIconSize}px`} />

  const [severityIcon] = useRecord(severity, {
    warning: <IconAlert />
  })

  const badge = (
    <IconBadge size={severityIconSize}>
      <SeverityIconContainer size={severityIconSize}>{severityIcon}</SeverityIconContainer>
    </IconBadge>
  )

  return (
    <Flex justifyContent='center'>
      <BadgePlacement shape='circle' badge={badge}>
        {coinIcon}
      </BadgePlacement>
    </Flex>
  )
}
