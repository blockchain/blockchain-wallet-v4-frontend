import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Button, FlatLoader, Icon, Text } from 'blockchain-info-components'

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
  margin-top: 26px;
`
const SuccessMessage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-content: center;
`
const SuccessIcon = styled(Icon)`
  margin-right: 14px;
`
const ButtonContainer = styled.div`
  margin-top: 35px;
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
      {isAuthenticating ? (
        <Content>
          <FlatLoader
            width='175px'
            height='25px'
            style={{ marginBottom: '20px' }}
          />
          <Text size='14px' weight={300}>
            <FormattedHTMLMessage
              id='modals.lockboxsetup.authenticitystep.step1'
              defaultMessage='Allow device manager on the device when prompted'
            />
          </Text>
        </Content>
      ) : (
        <Content>
          <SuccessMessage>
            <SuccessIcon
              name='checkmark-in-circle-filled'
              color='success'
              size='24px'
            />
            <Text size='16px' weight={300}>
              <FormattedHTMLMessage
                id='modals.lockboxsetup.authenticitystep.authentic'
                defaultMessage='Success! Your device appears to be authentic.'
              />
            </Text>
          </SuccessMessage>
          <ButtonContainer>
            <Button
              nature='success'
              onClick={() => props.handleStepChange()}
              fullwidth
            >
              <FormattedMessage
                id='modals.lockboxsetup.authenticitystep.success'
                defaultMessage='Click to Continue'
              />
            </Button>
          </ButtonContainer>
        </Content>
      )}
    </Wrapper>
  )
}

export default AuthenticityStep
