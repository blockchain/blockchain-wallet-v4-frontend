import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const APIAccess = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.apiaccess.title' defaultMessage='API access' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.apiaccess.description' defaultMessage='Use our API to interact with your wallet programmatically.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Link href='https://blockchain.info/api' target='_blank' rel='noopener noreferrer' size='13px' weight={300}>
          <FormattedMessage id='scenes.securitysettings.apiaccess.getstarted' defaultMessage='To get started, follow the steps here' />
        </Link>
      </SettingComponent>
    </SettingContainer>
  )
}

export default APIAccess
