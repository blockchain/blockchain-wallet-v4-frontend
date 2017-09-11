import React from 'react'
import { connect } from 'react-redux'

// import { selectors } from 'data'
import SecondPassword from './template.js'

class PasswordHintContainer extends React.Component {
  render () {
    return <SecondPassword {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  passwordHintStored: false // selectors.core.wallet.isPasswordHintOn(state)
})

export default connect(mapStateToProps)(PasswordHintContainer)
