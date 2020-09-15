import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

import { Container, Row } from './model'

const DarkText = styled(Text).attrs({
  color: 'grey700',
  size: '14px',
  weight: 400
})`
  display: inline;
  ${media.laptop`
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  `};
`
const CheckItOutButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  font-weight: 500;
  ${media.laptop`
    width: 100%;
  `};
`

export const USDDigital = () => (
  <Container>
    <Row marginBottom='6px'>
      <Text color='blue900' size='24px' weight={600}>
        <FormattedMessage
          defaultMessage='USD PAX is Now USD Digital'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usddigital'
        />
      </Text>
    </Row>
    <Row marginBottom='24px'>
      <DarkText size='12px' weight={500}>
        <FormattedMessage
          defaultMessage='March 2020'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usddigtal.March2020'
        />
      </DarkText>
    </Row>
    <Row marginBottom='24px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='USD PAX will now be referred to as USD Digital (USD-D, for short) and be represented by a green dollar symbol. If you had USD Pax in the past, they will maintain their value, we’re only changing their name.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usddigital.stable'
        />
      </DarkText>
    </Row>
    <Row>
      <LinkContainer to='/usd-d/transactions'>
        <CheckItOutButton>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.usddigital.checkit'
            defaultMessage='Check it Out'
          />
        </CheckItOutButton>
      </LinkContainer>
    </Row>
  </Container>
)

export default USDDigital
