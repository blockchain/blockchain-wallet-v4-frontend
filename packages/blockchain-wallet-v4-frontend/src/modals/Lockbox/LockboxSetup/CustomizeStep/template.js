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
  margin: 20px 0;
`
const ReminderText = styled(Text)`
  margin: 35px 0 8px;
`
const FinishSetupStep = props => {
  const { onNextStep } = props

  return (
    <Wrapper>
      <Image
        name='lockbox-onboard-name'
        width='100%'
        srcset={{ 'lockbox-onboard-name': '1x' }}
      />
      <IntroText size='13px' weight={300}>
        <FormattedMessage
          id='modals.lockboxsetup.pairdevice.intro'
          defaultMessage='Now it is time to add apps to your device. You will need to install an app for each asset that you would like to store on the device.'
        />
      </IntroText>
      <ReminderText size='11px' weight={300}>
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
