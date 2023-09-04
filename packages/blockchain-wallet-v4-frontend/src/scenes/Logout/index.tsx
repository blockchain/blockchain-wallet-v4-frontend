import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Link, Separator, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { deauthorizeBrowser, logoutClearReduxStore } from 'data/session/slice'

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

const LogoutContainer: React.FC = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(10)

  const dispatch = useDispatch()

  const onDeauthorizeBrowser = () => {
    dispatch(deauthorizeBrowser())
  }

  const onGoToLogin = () => {
    dispatch(logoutClearReduxStore())
  }

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsRemaining((seconds) => seconds - 1)
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [])

  if (secondsRemaining <= 0) {
    onGoToLogin()
  }

  return (
    <Wrapper>
      <Header>
        <Text size='22px' weight={400}>
          <FormattedMessage id='scenes.logout.title' defaultMessage='You are now logged out!' />
        </Text>
        {secondsRemaining <= 5 && (
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
          <FormattedMessage id='scenes.logout.deauth' defaultMessage='De-Authorize Browser' />
        </Button>
        <Link size='13px' weight={500} onClick={onGoToLogin}>
          <FormattedMessage id='buttons.continue_to_login' defaultMessage='Continue to Login' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default LogoutContainer
