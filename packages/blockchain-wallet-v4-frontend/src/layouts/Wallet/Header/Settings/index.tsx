import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import Settings from './template'

const SettingsContainer = ({ authActions, ...rest }) => (
  <Settings handleLogout={authActions.logout} {...rest} />
)

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(
  undefined,
  mapDispatchToProps
)

export default connector(SettingsContainer)
