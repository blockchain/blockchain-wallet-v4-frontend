import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { SceneWrapper, StickyHeader } from 'components/Layout'

import { MenuHeaderCentered, Title } from './model'

const TaxCenter = () => (
  <SceneWrapper>
    <StickyHeader>
      <MenuHeaderCentered>
        <Title size='40px' weight={600} color='black'>
          <FormattedMessage
            id='scenes.tax.center.title'
            defaultMessage='Blockchain.com Tax Center'
          />
        </Title>
        <Text size='14px' weight={500} color='grey700'>
          <FormattedMessage
            id='scenes.tax.center.descriptio'
            defaultMessage='Here’s everything you’ll need from Blockchain.com to file your taxes this year.'
          />
        </Text>
      </MenuHeaderCentered>
    </StickyHeader>
  </SceneWrapper>
)

export default TaxCenter
