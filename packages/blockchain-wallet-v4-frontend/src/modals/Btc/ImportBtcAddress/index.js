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
    const { position, close, submitting, invalid, network, priv } = this.props

    return (
      <ImportBtcAddress
        submitting={submitting}
        position={position}
        invalid={invalid}
        close={close}
        priv={utils.btc.isValidBtcPrivateKey(priv, network)}
        onSubmit={this.handleSubmit}
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
