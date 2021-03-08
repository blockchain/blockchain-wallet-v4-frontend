import React from 'react'
import { connect } from 'react-redux'
import { utils } from 'blockchain-wallet-v4/src'
import { compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { getData } from './selectors'
import ImportBtcAddress from './template.js'

class ImportBtcAddressContainer extends React.PureComponent {
  handleSubmit = () => {
    this.props.importBtcAddress()
  }

  render () {
    const { close, invalid, network, position, priv, submitting } = this.props

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
