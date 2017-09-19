import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import WalletRecoveryPhrase from './template.js'

class WalletRecoveryPhraseContainer extends React.Component {
  render () {
    return <WalletRecoveryPhrase {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state)
})

export default connect(mapStateToProps)(WalletRecoveryPhraseContainer)
