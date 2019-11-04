import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { getData } from './selectors'
import { utils } from 'blockchain-wallet-v4/src'
import ImportBtcAddress from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'

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
        priv={utils.btc.isValidBtcPrivateKey(priv, network)}
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
