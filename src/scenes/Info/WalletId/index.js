import React from 'react'

import { Text } from 'components/generic/Text'
import { Typography } from 'components/generic/Typography'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const WalletId = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <Text id='scenes.info.walletid.title' text='Wallet ID' capitalize />
        </SettingHeader>
        <SettingDescription>
          <Text id='scenes.info.walletid.description' text='Wallet ID is your unique identifier.' altFont light />
          <Text id='scenes.info.walletid.description2' text='It is completely individual to you, and it is what you will use to log in and access your wallet.' altFont light />
          <Text id='scenes.info.walletid.description3' text='It is NOT a bitcoin address for sending or receiving.' altFont light />
          <Text id='scenes.info.walletid.warning' text='Do not share your Wallet ID with others.' altFont light red />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Typography>29f92cab-4dba-90d5-8a68-ab9cd22c3582</Typography>
      </SettingComponent>
    </SettingContainer>
  )
}

export default WalletId
