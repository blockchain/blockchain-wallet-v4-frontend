import React from 'react'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import Bowser from 'bowser'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { Button, Link } from 'blockchain-info-components'

import linuxUpdater from 'assets/lockbox/lockbox-updater-1.0.0.AppImage'
import macUpdater from 'assets/lockbox/lockbox-updater-1.0.0.dmg'
import windowsUpdater from 'assets/lockbox/lockbox-updater-1.0.0.exe'

class DownloadUpdaterContainer extends React.PureComponent {
  getOsSpecificUpdater = () => {
    const os = Bowser.getParser(window.navigator.userAgent).getOSName(true)
    switch (os) {
      case 'macos':
        return {
          extension: 'dmg',
          updater: macUpdater
        }
      case 'linux':
        return {
          extension: 'AppImage',
          updater: linuxUpdater
        }
      default:
        return {
          extension: 'exe',
          updater: windowsUpdater
        }
    }
  }
  render () {
    return (
      <SettingContainer>
        <SettingSummary>
          <SettingHeader>
            <FormattedMessage
              id='scenes.lockbox.settings.downloadupdater.title'
              defaultMessage='Download Software Update'
            />
          </SettingHeader>
          <SettingDescription>
            <FormattedMessage
              id='scenes.lockbox.settings.downloadupdater.description'
              defaultMessage='Download software to update your device and apps to work with modern browsers'
            />
          </SettingDescription>
        </SettingSummary>
        <SettingComponent>
          <Link
            href={prop('updater', this.getOsSpecificUpdater())}
            download={`lockbox-updater-1.0.0.${prop(
              'extension',
              this.getOsSpecificUpdater()
            )}`}
          >
            <Button nature='empty'>
              <FormattedMessage
                id='scenes.lockbox.dashboard.updaterequirednotice.download'
                defaultMessage='Download'
              />
            </Button>
          </Link>
        </SettingComponent>
      </SettingContainer>
    )
  }
}

export default DownloadUpdaterContainer
