import React from 'react'
import styled from 'styled-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'

import { Button, FlatLoader, TextGroup, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 20px;
`

const Title = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

const StepText = styled(Text)`
  margin-bottom: 20px;
  .number {
    font-size: 20px;
    font-weight: 400;
    margin-right: 10px;
    color: ${props => props.theme['brand-secondary']};
  }
`

const ButtonContainer = styled.div`
  margin-top: 30px;
`

const AuthenticityStep = props => {
  const { isAuthenticating } = props

  return (
    <Wrapper>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.authenticitystep.title'
            defaultMessage='Verify Authenticity'
          />
        </Text>
      </Title>
      <TextGroup>
        <StepText size='16px' weight={300}>
          <span className='number'>1. </span>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.authenticitystep.step1'
            defaultMessage='Allow device manager onto device when prompted'
          />
        </StepText>
        <StepText size='16px' weight={300}>
          <span className='number'>2. </span>
          <FormattedHTMLMessage
            id='modals.lockboxsetup.authenticitystep.step2'
            defaultMessage='Wait for device to be verified'
          />
        </StepText>
      </TextGroup>
      { isAuthenticating ? (
        <FlatLoader width='150px' height='20px' />
      ) : (
        <ButtonContainer>
          <Button
            nature='success'
            onClick={() => props.handleStepChange()}
            fullwidth>
            <FormattedMessage
              id='modals.lockboxsetup.authenticitystep.success'
              defaultMessage='Success! Click to Continue'
            />
          </Button>
        </ButtonContainer>
      )}
    </Wrapper>
  )
}

export default AuthenticityStep
