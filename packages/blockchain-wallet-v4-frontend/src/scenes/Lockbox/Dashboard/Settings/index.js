import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Banner, Text } from 'blockchain-info-components'
import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import ExportXPub from './ExportXPub'
import AddDevice from './AddDevice'
import RestoreDevice from './RestoreDevice'
import UpdateDevice from './UpdateDevice'
import InstallApps from './InstallApps'

const SettingsContainer = styled.div`
  padding: 0 15px;
`

const BrowserWarning = styled(Banner)`
  margin-top: 18px;
`

export default class LockboxSettings extends React.PureComponent {
  render () {
    const { browserWarn, deviceIndex } = this.props
    return (
      <SettingsContainer>
        {browserWarn && (
          <BrowserWarning type='warning'>
            <Text color='warning' size='14px'>
              <FormattedMessage
                id='scenes.lockbox.settings.browserwarn'
                defaultMessage='Installing applications and updating firmware can only be done while using the Chrome browser.'
              />
            </Text>
          </BrowserWarning>
        )}
        <RenameDevice deviceIndex={deviceIndex} />
        <UpdateDevice deviceIndex={deviceIndex} />
        <InstallApps deviceIndex={deviceIndex} />
        <AddDevice />
        <RestoreDevice />
        <ExportXPub deviceIndex={deviceIndex} />
        <RemoveDevice deviceIndex={deviceIndex} />
      </SettingsContainer>
    )
  }
}
