import React from 'react'
import { Icon } from '@blockchain-com/constellation'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { statusConfig } from '../statusConfig'

interface IStatusBadge {
  status: string
}

const StatusText: React.FC<IStatusBadge> = ({ status }) => (
  <Flex alignItems='center'>
    <Icon label={status} color={statusConfig[status].color} size='sm'>
      {statusConfig[status].icon}
    </Icon>

    <Padding left={5}>
      <Text color={statusConfig[status].color} size='12px' lineHeight='18px' weight={500}>
        {statusConfig[status].text}
      </Text>
    </Padding>
  </Flex>
)

export default StatusText
