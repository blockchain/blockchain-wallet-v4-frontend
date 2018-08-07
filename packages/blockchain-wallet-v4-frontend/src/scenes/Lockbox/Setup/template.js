import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
`
const IntroContainer = styled.div`
  width: 750px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`
const GetStartedButton = styled(Button)`
  width: 75%;
  margin-top: 35px;
`

const Setup = props => {
  const { launchCarbonSetup } = props

  return (
    <Wrapper>
      <IntroContainer>
        <div>
          <Text size='26px' weight={600}>
            <FormattedMessage
              id='scenes.lockbox.welcome.title'
              defaultMessage='Hardware Secured Digital Assets'
            />
          </Text>
        </div>
        <div style={{ marginTop: '25px' }}>
          <Text size='14px' weight={300}>
            <FormattedMessage
              id='scenes.lockbox.welcome.subtitle'
              defaultMessage='Lockbox works with Carbon to give your digital assets an additional layer of security. Unlock your Lockbox by linking your Carbon, or buy one today.'
            />
          </Text>
        </div>
        <GetStartedButton nature='primary' onClick={launchCarbonSetup}>
          <FormattedMessage
            id='scenes.lockbox.welcome.getstarted'
            defaultMessage='Get Started'
          />
        </GetStartedButton>
      </IntroContainer>
    </Wrapper>
  )
}

export default Setup
