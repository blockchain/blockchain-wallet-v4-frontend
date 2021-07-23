import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { utils } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import ImportBtcAddress from './template.js'

class ImportBtcAddressContainer extends React.PureComponent {
  handleSubmit = () => {
    this.props.importBtcAddress()
  }

  render() {
    const { closeAll, invalid, network, position, priv, submitting } = this.props

    return (
      <ImportBtcAddress
        invalid={invalid}
        onClose={closeAll}
        onSubmit={this.handleSubmit}
        position={position}
        priv={utils.btc.isValidBtcPrivateKey(priv, network)}
        submitting={submitting}
      />
    )
  }
}

const mapStateToProps = getData

const mapDispatchToProps = (dispatch) => ({
  importBtcAddress: () =>
    dispatch(actions.components.importBtcAddress.importBtcAddressSubmitClicked())
})

const enhance = compose(
  modalEnhancer('IMPORT_BTC_ADDRESS_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ImportBtcAddressContainer)
