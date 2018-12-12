import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pathOr } from 'ramda'

import { actions, selectors } from 'data'
import BasicSecurity from './template'

class BasicSecurityContainer extends React.PureComponent {
  state = {
    editing: false,
    enabling: false,
    changeEmail: pathOr(false, ['location', 'state', 'changeEmail'], this.props)
  }

  componentWillUnmount () {
    this.onClose()
  }

  handleEnable = step => {
    this.setState({ enabling: step })
  }

  onClose = () => {
    if (this.state.enabling === 'recovery') {
      this.props.settingsActions.removeRecoveryPhrase()
    }
    this.setState({ enabling: false })
  }

  render () {
    return (
      <BasicSecurity
        progress={1}
        data={this.props}
        editing={this.state.editing}
        enabling={this.state.enabling}
        handleEnable={this.handleEnable}
        onClose={this.onClose}
        changeEmail={this.state.changeEmail}
        isMnemonicVerified={this.props.isMnemonicVerified}
      />
    )
  }
}

const mapStateToProps = state => ({
  authType: selectors.core.settings.getAuthType(state),
  emailVerified: selectors.core.settings.getEmailVerified(state),
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicSecurityContainer)
