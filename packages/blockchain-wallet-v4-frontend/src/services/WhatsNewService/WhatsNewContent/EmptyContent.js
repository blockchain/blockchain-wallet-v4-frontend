import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  >div: first-child {
    margin-bottom: 10px;
  }
  a {
    color: ${props => props.theme['brand-secondary']};
  }
`

const EmptyContent = ({ verifyIdentity }) => (
  <Wrapper>
    <Text size='20px'>
      <FormattedMessage
        id='layouts.wallet.header.whatsnew.whatsnew.empty'
        defaultMessage="🎉 You're all caught up!"
      />
    </Text>
    <Text size='12px' weight={300} color='gray-3'>
      <FormattedHTMLMessage
        id='layouts.wallet.header.whatsnew.whatsnew.in_progress'
        defaultMessage="Our team is always working on new features, but if there's something we can improve please let us know about it <a href='https://github.com/blockchain/blockchain-wallet-v4-frontend/issues' rel='noopener noreferrer' target='_blank'>here<a/>."
      />
    </Text>
  </Wrapper>
)
export default EmptyContent
