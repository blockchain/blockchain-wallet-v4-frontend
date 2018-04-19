import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'

import LoginIpRestriction from './template.js'

class LoginIpRestrictionContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.settingsActions.updateIpLockOn(Number(!this.props.ipLockOn.data))
  }

  render () {
    const { ui, ...rest } = this.props
    const ipLockOn = this.props.ipLockOn.data === 1

    return <LoginIpRestriction {...rest} ipLockOn={ipLockOn} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  ipLockOn: selectors.core.settings.getIpLockOn(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginIpRestrictionContainer)
