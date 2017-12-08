
import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import WalletAccessTor from './template.js'

class WalletAccessTorContainer extends React.Component {
  render () {
    return <WalletAccessTor {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  blockTorIps: selectors.core.settings.getBlockTorIps(state) === 1
})

export default connect(mapStateToProps)(WalletAccessTorContainer)
