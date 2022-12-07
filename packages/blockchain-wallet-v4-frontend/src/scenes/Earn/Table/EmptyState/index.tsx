import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

const EmptyState = () => (
  <Padding vertical={5}>
    <Flex alignItems='center' flexDirection='column' gap={24} justifyContent='center'>
      <Image name='earn-empty' />
      <Flex alignItems='center' flexDirection='column' gap={8} justifyContent='center'>
        <Text color={SemanticColors.title} variant='title2'>
          <FormattedMessage
            defaultMessage='No results found'
            id='scenes.earn.table.empty-search.title'
          />
        </Text>
        <Text color={SemanticColors.body} variant='body1'>
          <FormattedMessage
            defaultMessage='We couldn’t find the asset that you’re looking for.'
            id='scenes.earn.table.empty-search.description'
          />
        </Text>
      </Flex>
    </Flex>
  </Padding>
)

export default EmptyState
