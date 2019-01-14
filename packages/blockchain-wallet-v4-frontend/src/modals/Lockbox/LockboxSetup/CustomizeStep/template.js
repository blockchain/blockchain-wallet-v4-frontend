import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const IntroText = styled(Text)`
  margin: 12px 0 20px;
  text-align: center;
`
const ReminderText = styled(Text)`
  margin: 35px 0 14px;
`
const FinishSetupStep = props => {
  const { onNextStep } = props

  return (
    <Wrapper>
      <Image
        style={{ marginBottom: '18px' }}
        name='lockbox-onboard-customize'
        width='100%'
      />
      <IntroText size='13px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.pairdevice.intro'
          defaultMessage='Now the fun starts. It’s time to add apps to your device. You will need to install an app for each asset that you store on your device.'
        />
      </IntroText>
      <ReminderText size='10px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.customizestep.reminder'
          defaultMessage="Don't worry you can always change them later."
        />
      </ReminderText>
      <Button fullwidth onClick={onNextStep} nature={'primary'}>
        <FormattedMessage
          id='modals.lockboxsetup.customizestep.addapps'
          defaultMessage='Add Apps'
        />
      </Button>
    </Wrapper>
  )
}

export default FinishSetupStep
