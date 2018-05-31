import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Link, Separator, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Footer = styled.div`
  margin-top: 20px;
`

class FourthStep extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Header>
          <Text size='24px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.fourthstep.title' defaultMessage='Reset 2FA' />
          </Text>
        </Header>
        <Separator />
        <TextGroup inline>
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.fourthstep.message' defaultMessage='Thank you for submitting a two-factor authentication reset request. Please check your email for further instructions.' />
          </Text>
          <Text size='12px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.fourthstep.info' defaultMessage='This process usually takes two weeks. If you would like to learn more about the reset process, visit our ' />
          </Text>
          <Link size='12px' weight={300} href='https://support.blockchain.com/hc/en-us/articles/360000286426-I-lost-my-2FA-device-How-do-I-get-back-into-my-wallet-' target='_blank'>
            <FormattedMessage id='scenes.reset2fa.fourthstep.infolink' defaultMessage='support page.' />
          </Link>
        </TextGroup>
        <Footer>
          <LinkContainer to='/login'>
            <Button nature='primary' fullwidth uppercase>
              <FormattedMessage id='scenes.reset2fa.fourthstep.login' defaultMessage='Continue to Login' />
            </Button>
          </LinkContainer>
        </Footer>
      </Wrapper>
    )
  }
}
export default FourthStep
