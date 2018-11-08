import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Button, Text, TextGroup } from 'blockchain-info-components'

const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
`
const Content = styled(TextGroup)`
  text-align: center;
  margin-bottom: 20px;
  > * {
    margin-bottom: 0;
  }
`
const ButtonContainer = styled.div`
  margin-top: 20px;
`

// TODO: clean up in LB2
const InstallBtcAppStep = props => {
  const { continueBtnText, children, isInstalling, onContinue } = props

  return (
    <React.Fragment>
      <Title>
        <Text>
          <FormattedMessage
            id='modals.lockboxsetup.installbtcappstep.title'
            defaultMessage='Lockbox + Blockchain Wallet'
          />
        </Text>
      </Title>
      <Content>{children}</Content>
      <ButtonContainer>
        <Button
          fullwidth
          disabled={isInstalling}
          nature={isInstalling ? 'dark' : 'success'}
          onClick={onContinue}
        >
          {continueBtnText}
        </Button>
      </ButtonContainer>
    </React.Fragment>
  )
}

export default InstallBtcAppStep
