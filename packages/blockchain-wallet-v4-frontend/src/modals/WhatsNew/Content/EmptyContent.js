import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  a {
    color: ${props => props.theme.blue600};
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
    <Text size='12px' weight={400} color='grey400'>
      <FormattedHTMLMessage
        id='layouts.wallet.header.whatsnew.whatsnew.in_progress'
        defaultMessage="Our team is always working on new features, but if there's something we can improve please let us know about it <a href='https://github.com/blockchain/blockchain-wallet-v4-frontend/issues' rel='noopener noreferrer' target='_blank'>here<a/>."
      />
    </Text>
  </Wrapper>
)
export default EmptyContent
