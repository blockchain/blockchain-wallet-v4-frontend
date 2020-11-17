import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

export default props => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <BlockchainLoader width='80px' height='80px' />

        <Text color='grey800' weight={600}>
          <FormattedMessage
            id='modals.kycverification.veriff.title'
            defaultMessage='We’re Taking You to Veriff Now...'
          />
        </Text>

        <Text color='grey800' weight={600}>
          <FormattedMessage
            id='modals.kycverification.veriff.description'
            defaultMessage='Blockchain.com’s end-to-end verifaction service.'
          />
        </Text>
      </FlyoutWrapper>
    </Wrapper>
  )
}
