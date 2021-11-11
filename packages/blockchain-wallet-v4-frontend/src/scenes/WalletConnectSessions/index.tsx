import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { WalletConnectStep } from 'data/components/walletConnect/types'
import { ModalName } from 'data/modals/types'

function WalletConnectSessions(props) {
  useEffect(() => {
    const walletConnectSession = localStorage.getItem('walletConnectSession')
    const uri = localStorage.getItem('walletConnectUri')

    if (walletConnectSession && uri) {
      // props.walletConnectActions.initWalletConnect(uri)
      props.modalActions.showModal(ModalName.WALLET_CONNECT_MODAL, {
        origin: 'WalletConnectSessions',
        uri
      })
      props.walletConnectActions.setSessionDetails(JSON.parse(walletConnectSession))
      props.walletConnectActions.setStep({ name: WalletConnectStep.SESSION_DASHBOARD })
    }
  }, [])

  return <div>Hello WalletConnect</div>
}

// props.walletConnectActions.initWalletConnect(this.props.uri)

// props.walletConnectActions.setSessionDetails

// props.walletConnectActions.setStep({ name: WalletConnectStep.SESSION_DASHBOARD })

// actions.modals.showModal(ModalName.WALLET_CONNECT_MODAL, walletConnect.data)

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  walletConnectActions: bindActionCreators(actions.components.walletConnect, dispatch)
})

export default connect(null, mapDispatchToProps)(WalletConnectSessions)
