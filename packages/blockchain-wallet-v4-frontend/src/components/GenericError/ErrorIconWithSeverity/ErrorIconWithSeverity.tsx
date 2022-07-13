import React from 'react'

import { Image } from 'blockchain-info-components'
import { BadgePlacement } from 'components/Badge'
import { ExternalSVG } from 'components/ExternalSVG'
import { Flex } from 'components/Flex'

import { ErrorIconWithSeverityComponent } from './ErrorIconWithSeverity.types'

const ErrorIconWithSeverity: ErrorIconWithSeverityComponent = ({
  iconStatusUrl,
  iconUrl,
  statusFallback,
  iconFallback = <Image name='card-error-icon' width='84px' />
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
