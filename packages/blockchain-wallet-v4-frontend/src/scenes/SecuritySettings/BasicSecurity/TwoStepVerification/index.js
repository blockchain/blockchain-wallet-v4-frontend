import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import TwoStepVerification from './template.js'

class TwoStepVerificationContainer extends React.Component {
  render () {
    return <TwoStepVerification {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  isTwoStepVerificationEnabled: true
})

export default connect(mapStateToProps)(TwoStepVerificationContainer)
