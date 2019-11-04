import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import LoginIpRestriction from './template'
import React from 'react'

class LoginIpRestrictionContainer extends React.PureComponent {
  handleClick = () => {
    this.props.settingsActions.updateIpLockOn(Number(!this.props.ipLockOn))
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
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginIpRestrictionContainer)
