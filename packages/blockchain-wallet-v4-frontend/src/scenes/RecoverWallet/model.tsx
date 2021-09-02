import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { RecoverSteps } from 'data/types'

export const ActionButton = styled(Button)`
  margin-top: 15px;
`

export const CartridgeSentContainer = styled.div`
  width: auto;
`

export const CircleBackground = styled.div<{ color?: string; size?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.size ? props.size : '48px')};
  height: ${(props) => (props.size ? props.size : '48px')};
  min-width: ${(props) => (props.size ? props.size : '48px')};
  background-color: ${(props) => (props.color ? props.theme[props.color] : props.theme.blue000)};
  border-radius: ${(props) => (props.size ? props.size : '48px')};
  margin: 8px 8px 8px 0;
`

const TopRow = styled.div`
  display: flex;
  margin-bottom: 16px;
`

export const placeholder = () => {
  return (
    <FormattedMessage
      id='scenes.recover.firststep.placeholder'
      defaultMessage='Enter your secret private key recovery phrase'
    />
  )
}

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const RectangleBackground = styled.div`
  background-color: ${(props) => props.theme.grey000};
  border-radius: 8px;
  margin-top: 24px;
  padding: 16px;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
`

export const LoaderRow = styled(Row)`
  justify-content: center;
  padding: 108px 0;
`

export const ReverifyIdentityInfoBox = () => {
  return (
    <RectangleBackground>
      <Text size='12px' weight={500} lineHeight='1.5' color='grey900'>
        <FormattedMessage
          id='scenes.recovery.reverify'
          defaultMessage='For your security, you may have to re-verify your identity before accessing your trading or interest account.'
        />
      </Text>
    </RectangleBackground>
  )
}

export const GoBackArrow = (props: { handleBackArrowClick: () => void }) => {
  return (
    <Row style={{ marginBottom: '16px' }} onClick={() => props.handleBackArrowClick()}>
      <Icon
        cursor
        data-e2e='recoverBack'
        name='arrow-left'
        size='24px'
        color='grey600'
        role='button'
        style={{ marginRight: '8px' }}
      />
      <Text size='14px' weight={600} color='grey600' cursor='pointer'>
        <FormattedMessage id='buttons.go_back' defaultMessage='Go Back' />
      </Text>
    </Row>
  )
}

export const BackArrowFormHeader = (props: {
  email: string
  guid?: string
  handleBackArrowClick: () => void
  step?: RecoverSteps
}) => {
  return (
    <>
      <TopRow>
        <Icon
          cursor
          data-e2e='signupBack'
          name='arrow-left'
          size='24px'
          color='grey600'
          style={{ marginRight: '8px' }}
          role='button'
          onClick={() => props.handleBackArrowClick()}
        />
        <Column>
          <Text color='grey900' size='14px' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.recovery.email'
              defaultMessage='Recovering {email}'
              values={{ email: props.email }}
            />
          </Text>
          {props.step !== RecoverSteps.RESET_ACCOUNT && (
            <Text color='grey600' size='12px' weight={600} lineHeight='1.5'>
              <FormattedMessage
                id='scences.login.wallet_guid'
                defaultMessage='Wallet: {guid}'
                values={{ guid: props.guid }}
              />
            </Text>
          )}
        </Column>
      </TopRow>
    </>
  )
}

export const SpinningLoaderCentered = () => {
  return (
    <LoaderRow>
      <SpinningLoader width='56px' height='56px' />,
    </LoaderRow>
  )
}
