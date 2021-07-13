import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import WalletRecoveryPhrase from './template'

class WalletRecoveryPhraseContainer extends React.PureComponent {
  handleBackupNow = () => {
    this.props.modalActions.showModal('RECOVERY_PHRASE_MODAL')
  }

  render() {
    const { isMnemonicVerified } = this.props
    return (
      <WalletRecoveryPhrase
        isMnemonicVerified={isMnemonicVerified}
        handleBackupNow={this.handleBackupNow}
      />
    )
  }
}

const mapStateToProps = state => ({
  isMnemonicVerified: selectors.core.wallet.isMnemonicVerified(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletRecoveryPhraseContainer)
