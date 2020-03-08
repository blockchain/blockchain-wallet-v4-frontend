import { Button, Text } from 'blockchain-info-components'
import { Container, Row } from 'components/WhatsNew'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const DarkText = styled(Text).attrs({
  color: 'gray-5',
  size: '16px',
  weight: 300
})`
  display: inline;
  ${media.laptop`
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  `};
`
const GetStartedButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  font-weight: 500;
  ${media.laptop`
    width: 100%;
  `};
`

export const USDPax = () => (
  <Container>
    <Row marginBottom='10px'>
      <Text color='blue900' size='24px' weight={600}>
        <FormattedMessage
          defaultMessage='A Digital US Dollar in Your Wallet'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usdpax.one'
        />
      </Text>
    </Row>
    <Row marginBottom='24px'>
      <DarkText size='14px'>
        <FormattedMessage
          defaultMessage='April 2019'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usdpax.april2019'
        />
      </DarkText>
    </Row>
    <Row marginBottom='24px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='USD Digital, a crypto backed 1:1 for the dollar, is now available in your web wallet to trade and transact with. You can use these digital dollars to de-risk in a moving market, manage inflation of your local currency, or move quickly between cryptos in your wallet. 1 $PAX = 1 $USD, always.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usdpax.stable1'
        />
      </DarkText>
    </Row>
    <Row>
      <LinkContainer to='/pax/transactions'>
        <GetStartedButton>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usdpax.checkit'
            defaultMessage='Check it Out!'
          />
        </GetStartedButton>
      </LinkContainer>
    </Row>
  </Container>
)

export default USDPax
