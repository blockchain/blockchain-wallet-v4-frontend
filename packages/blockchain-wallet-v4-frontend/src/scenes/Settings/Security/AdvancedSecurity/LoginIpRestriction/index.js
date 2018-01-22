import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import LoginIpRestriction from './template.js'

class LoginIpRestrictionContainer extends React.Component {
  render () {
    return <LoginIpRestriction {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  ipLockOn: Boolean(selectors.core.settings.getIpLockOn(state))
})

export default connect(mapStateToProps)(LoginIpRestrictionContainer)
