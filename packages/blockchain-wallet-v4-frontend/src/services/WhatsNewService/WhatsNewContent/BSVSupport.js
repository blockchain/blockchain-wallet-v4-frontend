import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Text } from 'blockchain-info-components'
import { Container, Row } from 'components/WhatsNew'
import media from 'services/ResponsiveService'

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

export const BSVSupport = () => (
  <Container>
    <Row marginBottom='10px'>
      <Text color='brand-primary' size='24px' weight={600}>
        <FormattedMessage
          defaultMessage='Now Supporting Bitcoin SV (BSV)!'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.bitcoincashsvsupport.now_supporting_sv'
        />
      </Text>
    </Row>
    <Row marginBottom='24px'>
      <DarkText size='14px'>
        <FormattedMessage
          defaultMessage='January 2019'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.bitcoincashsvsupport.january2019'
        />
      </DarkText>
    </Row>
    <Row marginBottom='24px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='Visit Settings to view your balance, exchange BSV for BTC, BCH, ETH, and XLM, or send BSV to any address.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.bitcoincashsvsupport.visitsettings'
        />
      </DarkText>
    </Row>
    <Row>
      <LinkContainer to='/settings/addresses/bsv'>
        <GetStartedButton>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.bitcoincashsvsupport.checkitout'
            defaultMessage='Check it out!'
          />
        </GetStartedButton>
      </LinkContainer>
    </Row>
  </Container>
)

export default BSVSupport
