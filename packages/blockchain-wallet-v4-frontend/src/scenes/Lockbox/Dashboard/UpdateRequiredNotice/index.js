import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import linuxUpdater from 'assets/lockbox/lockbox-updater-1.0.0.AppImage'
import macUpdater from 'assets/lockbox/lockbox-updater-1.0.0.dmg'
import windowsUpdater from 'assets/lockbox/lockbox-updater-1.0.0.exe'
import Bowser from 'bowser'
import { prop } from 'ramda'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import * as C from 'services/alerts'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  justify-content: space-between;
  ${media.tablet`
    flex-direction: column;
    height: 135px;
    align-items: center;
  `};
`
const LeftColumn = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 35px 0 25px;
  ${media.tablet`
    justify-content: center;
    margin: 10px 0 0;
    padding-left: 10px;
  `};
`
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
`
const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 18px;

  & > :last-child {
    margin-top: 5px;
  }
`
const IconContainer = styled.div`
  height: 55px;
  width: 55px;
  min-width: 55px;
  background: ${props => props.theme.blue100};
  border-radius: 50%;
`
const DownloadIcon = styled(Icon)`
  margin-left: 12px;
  margin-top: 10px;
`
const DismissDownloadText = styled(Text)`
  margin-top: 8px;
  &:hover {
    cursor: pointer;
  }
`
class UpdateRequiredNotice extends React.PureComponent {
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

  onSoftwareDownload = () => {
    this.props.modalActions.showModal('Confirm', {
      hideCancel: true,
      title: C.LOCKBOX_SOFTWARE_DOWNLOAD_TITLE,
      message: C.LOCKBOX_SOFTWARE_DOWNLOAD_MSG
    })
    this.props.preferencesActions.hideLockboxSoftwareDownload()
  }

  render() {
    const { preferencesActions, showLockboxDownload } = this.props

    return (
      showLockboxDownload && (
        <Wrapper>
          <LeftColumn>
            <IconContainer>
              <DownloadIcon name='request' color='blue600' size='30px' />
            </IconContainer>
            <HeaderText>
              <Text size='18px' weight={700}>
                <FormattedMessage
                  id='scenes.lockbox.dashboard.updaterequirednotice.title'
                  defaultMessage='Software Update Required'
                />
              </Text>
              <TextGroup inline>
                <Text size='14px'>
                  <FormattedMessage
                    id='scenes.lockbox.dashboard.updaterequirednotice.subtitle'
                    defaultMessage='In order to continue using your Lockbox, you must first update your device and reinstall the apps via the following updating software.'
                  />
                </Text>
                {/* TODO: update link */}
                <Link
                  href='https://blockchain.zendesk.com/hc/en-us/sections/360002593291-Setting-Up-Lockbox'
                  size='14px'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <FormattedMessage
                    id='scenes.lockbox.dashboard.updaterequirednotice.learn'
                    defaultMessage='Learn more'
                  />
                </Link>
              </TextGroup>
            </HeaderText>
          </LeftColumn>
          <RightColumn>
            <Link
              href={prop('updater', this.getOsSpecificUpdater())}
              download={`lockbox-updater-1.0.0.${prop(
                'extension',
                this.getOsSpecificUpdater()
              )}`}
            >
              <Button nature='primary' onClick={this.onSoftwareDownload}>
                <FormattedMessage
                  id='scenes.lockbox.dashboard.updaterequirednotice.download'
                  defaultMessage='Download Software'
                />
              </Button>
            </Link>
            <DismissDownloadText
              size='11px'
              color='blue600'
              weight={500}
              onClick={() => preferencesActions.hideLockboxSoftwareDownload()}
            >
              <FormattedMessage
                id='scenes.lockbox.dashboard.updaterequirednotice.dismiss'
                defaultMessage="I've already updated"
              />
            </DismissDownloadText>
          </RightColumn>
        </Wrapper>
      )
    )
  }
}

const mapStateToProps = state => ({
  showLockboxDownload: selectors.preferences.getShowLockboxSoftwareDownload(
    state
  )
})
const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateRequiredNotice)
