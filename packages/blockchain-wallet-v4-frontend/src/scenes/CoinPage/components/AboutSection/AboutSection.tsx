import React from 'react'

import { Text } from 'blockchain-info-components'

import { Card } from '../../../../components/Card'
import { Flex } from '../../../../components/Flex'
import { PaddingAll } from '../../../../components/Padding'
import { AboutSectionComponent } from './types'

export const AboutSection: AboutSectionComponent = ({ actions, content, title }) => {
  return (
    <Card>
      <PaddingAll size={16}>
        <Flex flexDirection='column' gap={16}>
          <Text size='14px' weight={500} lineHeight='20px' color='grey600'>
            {title}
          </Text>

          <Text size='14px' weight={500} lineHeight='20px' color='grey900'>
            {content}
          </Text>

          <Flex flexDirection='row' gap={32}>
            {actions}
          </Flex>
        </Flex>
      </PaddingAll>
    </Card>
  )
}
