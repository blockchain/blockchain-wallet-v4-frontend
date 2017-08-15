import React from 'react'

import { Link, Text } from 'blockchain-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const APIAccess = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.settings.api.title' text='API access' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.settings.api.description' text='Use our API to interact with your wallet programmatically.' altFont light />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link href='https://github.com/blockchain/service-my-wallet-v3#installation' target='_blank'>
          <Text id='scenes.settings.api.getstarted' text='To get started, follow the steps here' small light cyan />
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default APIAccess
