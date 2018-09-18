import React from 'react'
import styled from 'styled-components'
import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { RotateSync } from 'components/RotateSync'

const Wrapper = styled.div`
  padding: 20px;
`
const Title = styled.div`
  text-align: center;
  margin-bottom: 40px;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 26px;
`
const ButtonContainer = styled.div`
  margin-top: 35px;
`
const RotateSyncContainer = styled(RotateSync)`
  margin-left: 15px;
`

const AuthenticityStep = props => {
  const { isAuthenticating } = props.authenticity

  return (
    <Wrapper>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.authenticitystep.title'
            defaultMessage='Verify Device Authenticity'
          />
        </Text>
      </Title>
      <Content>
        <Text weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.authenticitystep.content'
            defaultMessage='Click <b>Allow Device Manager</b> on the device if and when prompted'
          />
        </Text>
      </Content>
      <ButtonContainer>
        <Button
          fullwidth
          disabled={isAuthenticating}
          onClick={() => props.handleStepChange()}
          nature={isAuthenticating ? 'gray' : 'success'}
        >
          {isAuthenticating ? (
            <FormattedMessage
              id='modals.lockboxsetup.authenticitystep.authenticating'
              defaultMessage='Checking Your Devices Authenticity'
            />
          ) : (
            <FormattedMessage
              id='modals.lockboxsetup.authenticitystep.success'
              defaultMessage='Success! Click to Continue'
            />
          )}
          {isAuthenticating && (
            <RotateSyncContainer size='16px' color='white' />
          )}
        </Button>
      </ButtonContainer>
    </Wrapper>
  )
}

export default AuthenticityStep
