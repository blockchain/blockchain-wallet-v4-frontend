import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, Link, Text, TextGroup } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`
const Footer = styled.div`
  margin-top: 20px;
`

class ThirdStep extends React.PureComponent {
  render() {
    return (
      <Wrapper>
        <Header>
          <Text size='20px' color='blue900' weight={600} capitalize>
            <FormattedMessage
              id='scenes.reset2fa.thirdstep.title'
              defaultMessage='Reset 2FA'
            />
          </Text>
        </Header>
        <TextGroup inline>
          <Text size='12px' weight={500}>
            <FormattedMessage
              id='scenes.reset2fa.thirdstep.message'
              defaultMessage='Thank you for submitting a two-factor authentication reset request. Please check your email for further instructions.'
            />
          </Text>
          <Text size='12px' weight={500}>
            <FormattedMessage
              id='scenes.reset2fa.thirdstep.info'
              defaultMessage='This process usually takes two weeks. If you would like to learn more about the reset process, visit our '
            />
          </Text>
          <Link
            size='12px'
            weight={500}
            href='https://support.blockchain.com/hc/en-us/articles/360000286426-I-lost-my-2FA-device-How-do-I-get-back-into-my-wallet-'
            target='_blank'
          >
            <FormattedMessage
              id='scenes.reset2fa.thirdstep.infolink'
              defaultMessage='support page.'
            />
          </Link>
        </TextGroup>
        <Footer>
          <LinkContainer to='/login'>
            <Button nature='primary' fullwidth>
              <FormattedMessage
                id='scenes.reset2fa.thirdstep.login'
                defaultMessage='Continue to Login'
              />
            </Button>
          </LinkContainer>
        </Footer>
      </Wrapper>
    )
  }
}
export default ThirdStep
