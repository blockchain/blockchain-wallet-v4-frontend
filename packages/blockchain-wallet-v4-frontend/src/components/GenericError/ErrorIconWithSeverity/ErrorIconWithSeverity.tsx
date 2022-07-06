import React from 'react'
import { IconAlert } from '@blockchain-com/icons'

import { Image } from 'blockchain-info-components'
import { BadgePlacement, IconBadge } from 'components/Badge'
import { ExternalSVG } from 'components/ExternalSVG'
import { Flex } from 'components/Flex'

import { ErrorIconWithSeverityComponent } from './ErrorIconWithSeverity.types'

const ErrorIconWithSeverity: ErrorIconWithSeverityComponent = ({
  iconStatusUrl,
  iconUrl,
  statusFallback = (
    <IconBadge color='orange600' size={1.5}>
      <IconAlert />
    </IconBadge>
  ),
  iconFallback = <Image name='empty-search' width='100%' height='100%' />
}) => {
  return (
    <Flex justifyContent='center'>
      <BadgePlacement
        shape='circle'
        badge={
          <ExternalSVG width={1.5} height={1.5} href={iconStatusUrl} fallback={statusFallback} />
        }
      >
        <ExternalSVG width={4.5} height={4.5} href={iconUrl} fallback={iconFallback} />
      </BadgePlacement>
    </Flex>
  )
}

export { ErrorIconWithSeverity }
