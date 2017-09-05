
import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import MobileNumber from './template.js'

class MobileNumberContainer extends React.Component {
  render () {
    return <MobileNumber {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  smsVerified: selectors.core.settings.getSmsVerified(state)
})

export default connect(mapStateToProps)(MobileNumberContainer)
