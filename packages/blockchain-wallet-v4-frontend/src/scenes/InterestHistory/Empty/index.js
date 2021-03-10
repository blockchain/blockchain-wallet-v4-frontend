import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  & > :first-child {
    margin-bottom: 10px;
  }
`

const Empty = () => (
  <Wrapper>
    <Text size='20px' weight={600} color='grey800' lineHeight='20px'>
      <FormattedMessage
        id='scenes.exchangehistory.empty.transactions'
        defaultMessage='Transactions'
      />
    </Text>
    <Text size='14px' weight={500} color='grey600' lineHeight='20px'>
      <FormattedMessage
        id='scenes.interesthistory.empty.here'
        defaultMessage='All your Interest transactions will show up here.'
      />
    </Text>
  </Wrapper>
)

export default Empty
