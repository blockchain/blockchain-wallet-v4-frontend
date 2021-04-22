import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'

import { LoginSteps, Props as OwnProps  } from '..'

const TopRow = styled.div`
  display: flex;
  align-items: center;
`

const Body = styled.div`
display: flex;
`
const TextColumn = styled.div`
display: flex;
flex-direction: column;
`

const VerificationMobile = (props: InjectedFormProps<{}, Props> & Props) => {
    const {formValues, setStep} = props

    return (
        <> 
        <TopRow>
              <Icon
                cursor
                data-e2e='signupBack'
                name='arrow-left'
                size='24px'
                color='grey400'
                style={{ marginRight: '6px' }}
                role='button'
                onClick={()=> setStep(LoginSteps.ENTER_EMAIL_GUID)}
              />
              <Text color='grey400' size='14px' weight={600}>
                <FormattedMessage
                  id='scenes.login.signingin_email'
                  defaultMessage='Signing in with {email}'
                  values={{email: formValues.guidOrEmail}}
                />
              </Text>  
        </TopRow>
        <Icon name='padlock' color='green600' size='20px' />
        <Body>
            <TextColumn>
                <Text color='grey900' size='16px' weight={600} lineHeight='1.5'>
                    <FormattedMessage 
                    id='scenes.login.wallet.connected.title'
                    defaultMessage='Mobile Device Connected'
                    />
                </Text>
                <Text color='grey900' size='12px' weight={500}>
                    <FormattedMessage
                    id='scenes.login.wallet.connected.description_1'
                    defaultMessage='We sent your connected mobile device a notification. Open the app to confirm to auto-log in on the web.'
                    />
                </Text>
                <Text color='grey900' size='12px' weight={500}>
                    <FormattedMessage 
                    id='scenes.login.wallet.connected.description_2'
                    defaultMessage='Didn’t get the notification? Make sure you have push notifications enabled. You can also scan this QR with your mobile app to login.'
                    />
                </Text>
            </TextColumn>
        </Body>
        </>  
    )
}

type Props = OwnProps & {
    busy: boolean
    loginError?: string
    setStep: (step: LoginSteps) => void
  }

export default VerificationMobile
