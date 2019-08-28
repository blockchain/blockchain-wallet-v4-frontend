import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Settings from './template'

const SettingsContainer = ({ authActions, ...rest }) => (
  <Settings handleLogout={authActions.logout} {...rest} />
)

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(SettingsContainer)
