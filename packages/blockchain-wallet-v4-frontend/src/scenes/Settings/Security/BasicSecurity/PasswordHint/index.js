import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import SecondPassword from './template.js'

class PasswordHintContainer extends React.PureComponent {
  render () {
    return <SecondPassword {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  passwordHintStored: selectors.core.settings.getHint(state) !== undefined && selectors.core.settings.getHint(state) !== 'undefined'
})

export default connect(mapStateToProps)(PasswordHintContainer)
