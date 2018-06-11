import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Link, Separator, Text } from 'blockchain-info-components'

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > a {
    margin-top: 10px;
  }
`

const Logout = (props) => {
  const { onDeauthorizeBrowser, secondsRemaining } = props

  return (
    <Wrapper>
      <Header>
        <Text size='22px' weight={300}>
          <FormattedMessage id='scenes.logout.title' defaultMessage='You are now logged out!' />
        </Text>
        { secondsRemaining >= 6
          ? null
          : (
            <Text size='12px' weight={200}>
              Refreshing in {secondsRemaining} seconds...
            </Text>
          )
        }
      </Header>
      <Separator />
      <Text size='14px' weight={300}>
        <FormattedMessage id='scenes.logout.message' defaultMessage='Click the button below to require authorization the next time you login with this browser. Do this if you are using a shared or public computer.' />
      </Text>
      <Footer>
        <Button type='submit' nature='primary' onClick={onDeauthorizeBrowser}>
          <FormattedMessage id='scenes.logout.deauth' defaultMessage='De-Authorize Browser' />
        </Button>
        <LinkContainer to='/login' style={{}}>
          <Link size='13px' weight={300}>
            <FormattedMessage id='scenes.logout.continue' defaultMessage='Continue to Login' />
          </Link>
        </LinkContainer>
      </Footer>
    </Wrapper>
  )
}

export default Logout
