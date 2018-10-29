import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'

import { Button } from 'blockchain-info-components'

const AddXlm = props => {
  const { onAddClick, isBrowserChrome } = props

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.lockbox.settings.addxlm.title'
            defaultMessage='Add Stellar'
          />
        </SettingHeader>
        <SettingDescription>
          <FormattedMessage
            id='scenes.lockbox.settings.addxlm.description'
            defaultMessage='Add XLM to your wallet'
          />
        </SettingDescription>
      </SettingSummary>
      <SettingComponent>
        <Button nature='empty' onClick={onAddClick} disabled={!isBrowserChrome}>
          <FormattedMessage
            id='scenes.lockbox.settings.addxlm.addxlm'
            defaultMessage='Add Stellar'
          />
        </Button>
      </SettingComponent>
    </SettingContainer>
  )
}

export default AddXlm
