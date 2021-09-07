import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'
import {
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

const APIAccess = () => {
  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.securitycenter.advanced.apiaccess.title'
            defaultMessage='API Access'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.securitycenter.advanced.apiaccess.description.part1'
            defaultMessage='Use our API to interact with your wallet programmatically. Follow the steps'
          />{' '}
          <Link
            margin-right='0px'
            href='https://blockchain.com/api'
            target='_blank'
            rel='noopener noreferrer'
            size='13px'
            weight={500}
          >
            <FormattedMessage id='copy.here' defaultMessage='here' />
          </Link>
          <FormattedMessage
            id='scenes.securitycenter.advanced.apiaccess.description.part3'
            defaultMessage='to get started.'
          />
        </SettingDescription>
      </SettingSummary>
    </SettingContainer>
  )
}

export default APIAccess
