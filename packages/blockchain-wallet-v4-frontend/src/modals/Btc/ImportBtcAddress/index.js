import { actions } from 'data'
import { compose } from 'redux'
import { connect } from 'react-redux'
import React from 'react'

import { getData } from './selectors'
import { utils } from 'blockchain-wallet-v4/src'
import ImportBtcAddress from './template.js'
import modalEnhancer from 'providers/ModalEnhancer'

class ImportBtcAddressContainer extends React.PureComponent {
  handleSubmit = () => {
    this.props.importBtcAddress()
  }

  render () {
    const {
      closeAll,
      invalid,
      network,
      position,
      priv,
      submitting
    } = this.props

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

const mapDispatchToProps = dispatch => ({
  importBtcAddress: () =>
    dispatch(
      actions.components.importBtcAddress.importBtcAddressSubmitClicked()
    )
})

const enhance = compose(
  modalEnhancer('ImportBtcAddress'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ImportBtcAddressContainer)
