import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'

import TwoStepVerification from './template'

class TwoStepVerificationRememberContainer extends React.PureComponent {
  render() {
    return <TwoStepVerification {...this.props} />
  }
}

const mapStateToProps = state => ({
  authTypeNeverSave: selectors.core.settings
    .getAuthTypeNeverSave(state)
    .getOrElse(0)
})

export default connect(mapStateToProps)(TwoStepVerificationRememberContainer)
