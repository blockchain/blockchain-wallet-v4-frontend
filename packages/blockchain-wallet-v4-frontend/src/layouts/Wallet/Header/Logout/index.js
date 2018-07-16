import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Logout from './template.js'

const LogoutContainer = ({ authActions }) => (
  <Logout handleLogout={authActions.logout} />
)

const mapDispatchToProps = dispatch => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(LogoutContainer)
