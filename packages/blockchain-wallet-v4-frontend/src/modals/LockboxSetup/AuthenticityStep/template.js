import React from 'react'
import styled from 'styled-components'
import { Button, Image, Text } from 'blockchain-info-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { RotateSync } from 'components/RotateSync'

const Wrapper = styled.div``

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 15px;
`
const ButtonContainer = styled.div`
  margin-top: 20px;
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
        <Text size='14px' weight={300}>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.authenticitystep.content'
            defaultMessage='On your Lockbox, tap the RIGHT button to let your Lockbox connect to your Blockchain wallet.'
          />
        </Text>
      </Content>
      <Image
        name='lockbox-onboard-verify'
        width='100%'
        srcset={{
          'lockbox-onboard-verify2': '2x',
          'lockbox-onboard-verify3': '3x'
        }}
      />
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
