import React from 'react'
import { actions, model, selectors } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { Button } from 'blockchain-info-components'

const { TAKE_TOUR } = model.analytics.LOCKBOX_EVENTS.SETTINGS
class TakeTourContainer extends React.PureComponent {
  onStartTour = () => {
    this.props.routerActions.push(
      `/lockbox/dashboard/${this.props.deviceIndex}`
    )
    this.props.lockboxActions.setProductTourVisibility(true)
    this.props.analyticsActions.logEvent(TAKE_TOUR)
  }

  render () {
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
              id='scenes.lockbox.settings.taketour.description'
              defaultMessage='Take a quick, interactive tour of the features of Lockbox.'
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakeTourContainer)
