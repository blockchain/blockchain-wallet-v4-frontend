import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { LoginSteps } from 'data/types'

import { Props as OwnProps } from '..'
import { BackArrowFormHeader, CircleBackground } from '../model'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CheckEmail = (props: Props) => {
  const { cacheActions, formActions, formValues, setStep } = props
  return (
    <>
      <BackArrowFormHeader
        cacheActions={cacheActions}
        formActions={formActions}
        formValues={formValues}
        setStep={setStep}
      />
      <FormBody>
        <CircleBackground>
          <Icon name='computer' color='white' size='24px' />
        </CircleBackground>
        <Text color='grey900' size='20px' weight={600} lineHeight='1.5'>
          <FormattedMessage
            id='copy.verifyyourdevice'
            defaultMessage='Verify Your Device'
          />
        </Text>
        <Text
          color='grey600'
          size='16px'
          weight={400}
          lineHeight='1.5'
          style={{ margin: '8px 0 24px 0' }}
        >
          <FormattedMessage
            id='scenes.login.checkemail'
            defaultMessage='Check your email and click the link to continue.'
          />
        </Text>
      </FormBody>
      <Button
        nature='empty-blue'
        fullwidth
        height='48px'
        data-e2e='loginResendEmail'
        // onClick={()=> 'whatever action resends email'}
      >
        <FormattedMessage
          id='buttons.email_didnt_arrive'
          defaultMessage="Email didn't arrive?"
        />
      </Button>
    </>
  )
}

type Props = OwnProps & {
  busy: boolean
  loginError?: string
  setStep: (step: LoginSteps) => void
}

export default CheckEmail
