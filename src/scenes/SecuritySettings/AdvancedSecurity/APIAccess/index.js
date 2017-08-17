import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/shared/Setting'

const APIAccess = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.settings.api.title' defaultMessage='API access' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.settings.api.description' defaultMessage='Use our API to interact with your wallet programmatically.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link href='https://github.com/blockchain/service-my-wallet-v3#installation' target='_blank'>
          <FormattedMessage id='scenes.settings.api.getstarted' defaultMessage='To get started, follow the steps here' />
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default APIAccess
