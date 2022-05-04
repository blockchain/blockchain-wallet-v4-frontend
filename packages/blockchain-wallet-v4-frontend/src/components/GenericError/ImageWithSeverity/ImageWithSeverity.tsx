import React from 'react'
import { IconAlert } from '@blockchain-com/icons'
import { useRecord } from 'hooks'

import { BadgePlacement, IconBadge } from 'components/Badge'
import { Flex } from 'components/Flex'

import { ImageWithSeverityComponent } from './ImageWithSeverity.types'

const ImageWithSeverity: ImageWithSeverityComponent = ({ children, severity = 'warning' }) => {
  const [severityBadge] = useRecord(severity, {
    warning: (
      <IconBadge color='orange600'>
        <IconAlert />
      </IconBadge>
    )
  })

  return (
    <Flex justifyContent='center'>
      <BadgePlacement shape='circle' badge={severityBadge}>
        {children}
      </BadgePlacement>
    </Flex>
  )
}

export default ImageWithSeverity
