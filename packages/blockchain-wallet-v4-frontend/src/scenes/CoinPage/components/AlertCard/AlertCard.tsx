import React from 'react'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { Container } from './styles'
import { AlertCardComponent } from './types'

export const AlertCard: AlertCardComponent = ({ content, title }) => {
  return (
    <Container>
      <Padding all={16}>
        <Flex gap={8} flexDirection='column'>
          <Text weight={600} size='14px' lineHeight='20px'>
            {title}
          </Text>

          <Text weight={500} size='12px' lineHeight='16px'>
            {content}
          </Text>
        </Flex>
      </Padding>
    </Container>
  )
}
