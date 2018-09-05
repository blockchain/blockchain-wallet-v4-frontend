import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import ImportBtcAddress from './template.js'
import { getData } from './selectors'
import { utils } from 'blockchain-wallet-v4/src'

class ImportBtcAddressContainer extends React.PureComponent {
  render () {
    const {
      position,
      close,
      submitting,
      invalid,
      isAddressInternal,
      isAddressExternal,
      network,
      actions,
      priv
    } = this.props

    return (
      <ImportBtcAddress
        isAddressInternal={isAddressInternal}
        isAddressExternal={isAddressExternal}
        submitting={submitting}
        position={position}
        invalid={invalid}
        network={network}
        close={close}
        priv={utils.bitcoin.isValidBitcoinPrivateKey(priv, network)}
        onSubmit={() => actions.importBtcAddressSubmitClicked()}
      />
    )
  }
}

const mapStateToProps = getData

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.importBtcAddress, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('ImportBtcAddress'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ImportBtcAddressContainer)
