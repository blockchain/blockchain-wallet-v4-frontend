import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { SettingComponent, SettingContainer, SettingDescription, SettingHeader, SettingSummary } from 'components/Setting'

const BitcoinUnit = (props) => {
  const { message } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage id='scenes.preferences.unit.title' defaultMessage='Bitcoin unit' />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage id='scenes.preferences.unit.description' defaultMessage='Adjust the precision you would prefer bitcoin values to be displayed in.' />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Text>{message}</Text>
      </SettingComponent>
    </SettingContainer>
  )
}

export default BitcoinUnit
