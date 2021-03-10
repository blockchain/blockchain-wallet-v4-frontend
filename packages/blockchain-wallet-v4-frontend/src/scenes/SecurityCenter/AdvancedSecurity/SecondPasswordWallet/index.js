import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'

import SecondPassword from './template'

class SecondPasswordWalletContainer extends React.PureComponent {
  render() {
    return <SecondPassword {...this.props} />
  }
}

const mapStateToProps = state => ({
  secondPasswordEnabled: selectors.core.wallet.isSecondPasswordOn(state)
})

export default connect(mapStateToProps)(SecondPasswordWalletContainer)
