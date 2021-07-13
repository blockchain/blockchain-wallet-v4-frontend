import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { actions, selectors } from 'data'

class TakeTourContainer extends React.PureComponent {
  onStartTour = () => {
    this.props.routerActions.push(
      `/lockbox/dashboard/${this.props.deviceIndex}`
    )
    this.props.lockboxActions.setProductTourVisibility(true)
  }

  render() {
    return (
      <SettingContainer>
        <SettingSummary>
          <SettingHeader>
            <FormattedMessage
              id='scenes.lockbox.settings.taketour.title'
              defaultMessage='Product Tour'
            />
          </SettingHeader>
          <SettingDescription>
            <FormattedMessage
              id='scenes.lockbox.settings.taketour.description1'
              defaultMessage='Take a quick, interactive tour of the features of Lockbox'
            />
          </SettingDescription>
        </SettingSummary>
        <SettingComponent>
          <Button nature='empty' onClick={this.onStartTour}>
            <FormattedMessage
              id='scenes.lockbox.settings.taketour.take'
              defaultMessage='Take Tour'
            />
          </Button>
        </SettingComponent>
      </SettingContainer>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  deviceName: selectors.core.kvStore.lockbox
    .getDeviceName(state, ownProps.deviceIndex)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(TakeTourContainer)
