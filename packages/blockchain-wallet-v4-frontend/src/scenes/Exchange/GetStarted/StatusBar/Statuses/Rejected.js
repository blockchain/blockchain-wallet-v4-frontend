import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f26c57;
  border-radius: 4px;

  & > :not(:first-child) {
    margin-top: 8px;
  }

  @media (min-width: 960px) {
    width: 500px;
  }
`

export const Rejected = () => (
  <Wrapper>
    <Text color='white' size='14px' weight={400}>
      <FormattedMessage
        id='scenes.exchange.getstarted.status.rejected.title'
        defaultMessage='Account verification failed'
      />
    </Text>
    <Text size='14px' weight={300}>
      <FormattedMessage
        id='scenes.exchange.getstarted.status.rejected.description'
        defaultMessage='Unfortunately we had some trouble with the documents that you’ve supplied and we can’t verify your account at this time. '
      />
    </Text>
  </Wrapper>
)

export default Rejected
