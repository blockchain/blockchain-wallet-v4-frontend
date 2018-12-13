import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import * as bowser from 'bowser'

import { Banner, Text } from 'blockchain-info-components'
import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import ShowXPubs from './ShowXPubs'
import AddDevice from './AddDevice'
import RestoreDevice from './RestoreDevice'
import UpdateDevice from './UpdateDevice'
import AppManager from './AppManager'

const SettingsContainer = styled.div`
  padding: 0 30px;
`

const BrowserWarning = styled(Banner)`
  margin-top: 18px;
`

const isBrowserChrome = bowser.name === 'Chrome' || bowser.name === 'Chromium'

export default class LockboxSettings extends React.PureComponent {
  render () {
    const { deviceIndex } = this.props
    return (
      <SettingsContainer>
        {!isBrowserChrome && (
          <BrowserWarning type='warning'>
            <Text color='warning' size='14px'>
              <FormattedMessage
                id='scenes.lockbox.settings.browserwarn'
                defaultMessage='Adding new devices, installing applications and updating firmware can only be done while using the Chrome browser.'
              />
            </Text>
          </BrowserWarning>
        )}
        <RenameDevice deviceIndex={deviceIndex} />
        <UpdateDevice
          deviceIndex={deviceIndex}
          isBrowserChrome={isBrowserChrome}
        />
        <AppManager
          deviceIndex={deviceIndex}
          isBrowserChrome={isBrowserChrome}
        />
        <AddDevice isBrowserChrome={isBrowserChrome} />
        <RestoreDevice />
        <ShowXPubs deviceIndex={deviceIndex} />
        <RemoveDevice deviceIndex={deviceIndex} />
      </SettingsContainer>
    )
  }
}
