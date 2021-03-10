import React from 'react'
import { FormattedMessage } from 'react-intl'
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
const TitleText = styled(Text)`
  margin-top: 12px;
`
const SubtitleText = styled(Text)`
  margin-top: 8px;
`

export default () => {
  return (
    <Wrapper>
      <BlockchainLoader width='80px' height='80px' />

      <TitleText color='grey800' weight={600} size='20px'>
        <FormattedMessage
          id='modals.kycverification.veriff.title'
          defaultMessage='We’re Taking You to Veriff Now...'
        />
      </TitleText>

      <SubtitleText color='grey600' weight={600} size='14px'>
        <FormattedMessage
          id='modals.kycverification.veriff.desc'
          defaultMessage='Blockchain.com’s end-to-end verification service.'
        />
      </SubtitleText>
    </Wrapper>
  )
}
