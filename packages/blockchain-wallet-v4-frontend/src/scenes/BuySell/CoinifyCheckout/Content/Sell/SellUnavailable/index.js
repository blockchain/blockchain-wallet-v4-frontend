import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Link, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'

const Wrapper = styled.div`
  padding: 30px;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 10px;
`
const KycContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  flex-direction: column;
  display: flex;
`
const Divider = styled.div`
  border-bottom: 1px solid ${props => props.theme.grey000};
  padding-top: 20px;
  margin-bottom: 20px;
`

export default () => (
  <Wrapper>
    <KycContainer>
      <Header>
        <Text size='18px'>
          <FormattedMessage
            id='scenes.buysell.coinify.sellunavailable.header'
            defaultMessage='Sell Unavailable'
          />
        </Text>
      </Header>
      <Divider />
      <Text size='13px' weight={400} style={spacing('mb-20')}>
        <FormattedMessage
          id='scenes.buysell.coinify.sellunavailable.reason'
          defaultMessage="Unfortunately Sell is not currently available in your state. We're working hard to bring it back as soon as possible."
        />
      </Text>
      <Link
        href='https://support.blockchain.com/hc/en-us/articles/360000062126-How-do-I-create-a-sell-trade-'
        target='_blank'
      >
        <Text size='13px' weight={500} color='blue600'>
          <FormattedMessage
            id='scenes.buysell.coinify.sellunavailable.learnmore'
            defaultMessage='Learn More'
          />
        </Text>
      </Link>
    </KycContainer>
  </Wrapper>
)
