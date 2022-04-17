import React from 'react'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { Badge, Container } from './styles'
import { TabComponent } from './types'

export const Tab: TabComponent = ({ badgeColor, children, onClick, selected = false }) => {
  return (
    <Container selected={selected} onClick={onClick}>
      <Padding vertical={4} horizontal={12}>
        <Flex gap={6} alignItems='center'>
          {badgeColor ? <Badge $color={badgeColor} /> : null}

          <Text size='14px' weight={600} lineHeight='20px' color={selected ? 'blue600' : 'grey400'}>
            {children}
          </Text>
        </Flex>
      </Padding>
    </Container>
  )
}
