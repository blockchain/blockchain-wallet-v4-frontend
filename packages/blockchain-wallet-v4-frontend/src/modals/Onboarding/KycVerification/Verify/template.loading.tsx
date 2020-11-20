import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { BlockchainLoader, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

export default () => {
  return (
    <Wrapper>
      <BlockchainLoader width='80px' height='80px' />

      <Text color='grey800' weight={600} size='20px'>
        <FormattedMessage
          id='modals.kycverification.veriff.title'
          defaultMessage='We’re Taking You to Veriff Now...'
        />
      </Text>

      <Text color='grey600' weight={600} size='14px'>
        <FormattedMessage
          id='modals.kycverification.veriff.description'
          defaultMessage='Blockchain.com’s end-to-end verifaction service.'
        />
      </Text>
    </Wrapper>
  )
}
