import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'

export const ActionButton = styled(Button)`
  margin-top: 15px;
`

export const CartridgeSentContainer = styled.div`
  width: auto;
`

export const RecoveryCircleBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  min-width: 48px;
  background-color: ${(props) => props.theme.blue000};
  border-radius: 48px;
  margin: 8px 8px 8px 0;
`

const TopRow = styled.div`
  display: flex;
  margin-bottom: 24px;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

export const Row = styled.div`
  display: flex;
`

export const BackArrowFormHeader = (props: {
  email: string
  guid: string
  handleBackArrowClick: () => void
}) => {
  return (
    <>
      <TopRow>
        <Icon
          cursor
          data-e2e='signupBack'
          name='arrow-left'
          size='24px'
          color='grey400'
          style={{ marginRight: '8px' }}
          role='button'
          onClick={() => props.handleBackArrowClick()}
        />
        <Column>
          <Text color='grey400' size='14px' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scenes.login.signingin_email'
              defaultMessage='Signing in with {email}'
              values={{ email: props.email }}
            />
          </Text>
          <Text color='grey400' size='14px' weight={600} lineHeight='1.5'>
            <FormattedMessage
              id='scences.login.wallet_guid'
              defaultMessage='Wallet: {guid}'
              values={{ guid: props.guid }}
            />
          </Text>
        </Column>
      </TopRow>
    </>
  )
}
