import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pathOr } from 'ramda'
import BasicSecurity from './template'
import React from 'react'

class BasicSecurityContainer extends React.PureComponent {
  state = {
    changeEmail: pathOr(false, ['location', 'state', 'changeEmail'], this.props)
  }

  render () {
    return (
      <BasicSecurity
        data={this.props}
        onClose={this.onClose}
        changeEmail={this.state.changeEmail}
      />
    )
  }
}

const mapStateToProps = state => ({
  authType: selectors.core.settings.getAuthType(state),
  emailVerified: selectors.core.settings.getEmailVerified(state)
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicSecurityContainer)
