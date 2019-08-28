import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Bowser from 'bowser'

import { model } from 'data'
import { Banner, Text } from 'blockchain-info-components'
import AddDevice from './AddDevice'
import RenameDevice from './RenameDevice'
import RemoveDevice from './RemoveDevice'
import RestoreDevice from './RestoreDevice'
import ShowXPubs from './ShowXPubs'
import TakeTour from './TakeTour'
import UpdateDevice from './UpdateDevice'

const SettingsContainer = styled.div`
  padding: 0 30px;
`
const BrowserWarning = styled(Banner)`
  margin-top: 18px;
`
const browser = Bowser.getParser(window.navigator.userAgent)
const isBrowserSupported = browser.satisfies(
  model.components.lockbox.supportedBrowsers
)

export default class LockboxSettings extends React.PureComponent {
  render () {
    const { deviceIndex } = this.props
    return (
      <SettingsContainer>
        {!isBrowserSupported && (
          <BrowserWarning type='warning'>
            <Text color='warning' size='14px'>
              <FormattedMessage
                id='scenes.lockbox.settings.blockbrowser'
                defaultMessage='Adding new devices or applications, verifying authenticity and updating firmware can only be done while using the Brave, Chrome, Firefox or Opera browsers.'
              />
            </Text>
          </BrowserWarning>
        )}
        <RenameDevice deviceIndex={deviceIndex} />
        <UpdateDevice
          deviceIndex={deviceIndex}
          isBrowserSupported={isBrowserSupported}
        />
        <AddDevice isBrowserSupported={isBrowserSupported} />
        <RestoreDevice />
        <ShowXPubs deviceIndex={deviceIndex} />
        <TakeTour deviceIndex={deviceIndex} />
        <RemoveDevice deviceIndex={deviceIndex} />
      </SettingsContainer>
    )
  }
}
