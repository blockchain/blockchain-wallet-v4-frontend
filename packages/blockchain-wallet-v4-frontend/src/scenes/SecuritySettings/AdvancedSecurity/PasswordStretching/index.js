import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import PasswordStretching from './template.js'

class PasswordStretchingContainer extends React.Component {
  render () {
    return <PasswordStretching {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  passwordStretchingStored: selectors.core.wallet.getPbkdf2Iterations(state) !== undefined && selectors.core.wallet.getPbkdf2Iterations(state) !== 'undefined'
})

export default connect(mapStateToProps)(PasswordStretchingContainer)
