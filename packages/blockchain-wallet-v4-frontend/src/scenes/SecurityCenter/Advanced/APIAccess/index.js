import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'blockchain-info-components'
import { SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const APIAccess = (props) => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.securitysettings.apiaccess.title' defaultMessage='API Access' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.securitysettings.apiaccess.description1' defaultMessage='Use our API to interact with your wallet programmatically. Follow the steps' />
          <Link margin-right='0px' href='https://blockchain.info/api' target='_blank' rel='noopener noreferrer' size='13px' weight={300}>
            <FormattedMessage id='scenes.securitysettings.apiaccess.getstarted' defaultMessage='here' />
          </Link>
          <FormattedMessage id='scenes.securitysettings.apiaccess.description2' defaultMessage='to get started.' />
        </SettingDescription>
      </SettingSummary>
    </SettingContainer>
  )
}

export default APIAccess
