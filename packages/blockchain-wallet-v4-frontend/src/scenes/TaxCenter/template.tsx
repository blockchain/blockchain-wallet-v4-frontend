import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { SceneWrapper, StickyHeader } from 'components/Layout'
import MenuHeader from 'components/MenuHeader'

const Title = styled(Text)`
  margin-bottom: 8px;
`

const TaxCenter = () => (
  <SceneWrapper>
    <StickyHeader>
      <MenuHeader>
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
      </MenuHeader>
    </StickyHeader>
  </SceneWrapper>
)

export default TaxCenter
