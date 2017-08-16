import React from 'react'

import { SecondaryButton, Text, Typography } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const MobileNumber = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.preferences.mobile.title' text='Mobile number' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.preferences.mobile.description' text='Your mobile phone can be used to enable two-factor authentication,' altFont light/>
          <Text id='scenes.preferences.mobile.description' text='helping to secure your wallet from unauthorized access,' altFont light/>
          <Text id='scenes.preferences.mobile.description' text='and to send bitcoin payment alerts when you receive funds.' altFont light/>
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Typography>+447800000000</Typography>
        <SecondaryButton>
          <Text id='scenes.preferences.mobile.change' text='Change' small light white />
        </SecondaryButton>
      </SettingComponent>
    </SettingContainer>
  )
}

export default MobileNumber
