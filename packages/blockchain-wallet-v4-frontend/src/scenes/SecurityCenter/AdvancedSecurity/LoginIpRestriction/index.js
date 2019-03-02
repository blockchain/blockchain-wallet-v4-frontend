import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, model, selectors } from 'data'

import LoginIpRestriction from './template'

const { IP_RESTRICTIONS } = model.analytics.PREFERENCE_EVENTS.SECURITY
class LoginIpRestrictionContainer extends React.PureComponent {
  handleClick = () => {
    this.props.settingsActions.updateIpLockOn(Number(!this.props.ipLockOn))
    this.props.analyticsActions.logEvent([
      ...IP_RESTRICTIONS,
      !this.props.ipLockOn ? 'enable' : 'disable'
    ])
  }

  render () {
    const { ...rest } = this.props
    const ipLockOn = this.props.ipLockOn === 1

    return (
      <LoginIpRestriction
        {...rest}
        ipLockOn={ipLockOn}
        handleClick={this.handleClick}
      />
    )
  }
}

const mapStateToProps = state => ({
  ipLockOn: selectors.core.settings.getIpLockOn(state).getOrElse(0)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginIpRestrictionContainer)
