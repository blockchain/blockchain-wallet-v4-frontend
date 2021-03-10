import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'

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

const Logout = props => {
  const { onDeauthorizeBrowser, onGoToLogin, secondsRemaining } = props

  return (
    <Wrapper>
      <Header>
        <Text size='22px' weight={400}>
          <FormattedMessage
            id='scenes.logout.title'
            defaultMessage='You are now logged out!'
          />
        </Text>
        {secondsRemaining >= 6 ? null : (
          <Text size='12px' weight={400}>
            Refreshing in {secondsRemaining} seconds...
          </Text>
        )}
      </Header>
      <Separator />
      <Text size='14px' weight={400}>
        <FormattedMessage
          id='scenes.logout.message'
          defaultMessage='Click the button below to require authorization the next time you login with this browser. Do this if you are using a shared or public computer.'
        />
      </Text>
      <Footer>
        <Button
          data-e2e='deauthBrowser'
          type='submit'
          nature='primary'
          onClick={onDeauthorizeBrowser}
        >
          <FormattedMessage
            id='scenes.logout.deauth'
            defaultMessage='De-Authorize Browser'
          />
        </Button>
        <Link size='13px' weight={500} onClick={onGoToLogin}>
          <FormattedMessage
            id='scenes.logout.continue'
            defaultMessage='Continue to Login'
          />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default Logout
