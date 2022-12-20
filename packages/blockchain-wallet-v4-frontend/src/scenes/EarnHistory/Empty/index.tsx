import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

const Empty = () => (
  <Padding vertical={5}>
    <Flex alignItems='center' flexDirection='column' gap={24} justifyContent='center'>
      <Image name='earn-activity-empty' />
      <Flex alignItems='center' flexDirection='column' gap={8} justifyContent='center'>
        <Text color={SemanticColors.title} variant='title2'>
          <FormattedMessage
            defaultMessage='Your transactions go here'
            id='scenes.earnhistory.empty.title'
          />
        </Text>
        <Text color={SemanticColors.body} variant='body1'>
          <FormattedMessage
            defaultMessage='Once you start earning, those details will show up here.'
            id='scenes.earnhistory.empty.description'
          />
        </Text>
      </Flex>
    </Flex>
  </Padding>
)

export default Empty
