import React from 'react'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { ErrorContentComponent } from './ErrorContent.types'

const ErrorContent: ErrorContentComponent = ({ message, title }) => {
  return (
    <Flex alignItems='center' justifyContent='center' flexDirection='column' gap={8}>
      <Text
        color='grey900'
        weight={600}
        size='20px'
        lineHeight='30px'
        style={{ textAlign: 'center' }}
      >
        {title}
      </Text>

      <Text
        color='grey600'
        weight={500}
        size='14px'
        lineHeight='20px'
        style={{ textAlign: 'center' }}
      >
        {message}
      </Text>
    </Flex>
  )
}

export default ErrorContent
