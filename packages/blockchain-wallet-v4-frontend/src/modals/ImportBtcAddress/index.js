import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'

import modalEnhancer from 'providers/ModalEnhancer'
import ImportBtcAddress from './template.js'
import { getData } from './selectors'
import { utils } from 'blockchain-wallet-v4/src'

class ImportBtcAddressContainer extends React.PureComponent {
  constructor () {
    super()

    this.updateAddress = this.updateAddress.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  updateAddress (value) {
    if (value && utils.bitcoin.isValidBitcoinPrivateKey(value)) {
      const format = utils.bitcoin.detectPrivateKeyFormat(value)
      const key = utils.bitcoin.privateKeyStringToKey(value, format)
      const address = key.getAddress()
      this.props.formActions.change('importBtcAddress', 'address', address)
    }
  }

  handleChange (e) {
    const value = e.target.value
    this.updateAddress(value)
  }

  render () {
    const {
      position,
      close,
      submitting,
      invalid,
      isAddressInternal,
      isAddressExternal,
      priv,
      actions
    } = this.props

    return (
      <ImportBtcAddress
        isAddressInternal={isAddressInternal}
        isAddressExternal={isAddressExternal}
        position={position}
        submitting={submitting}
        invalid={invalid}
        close={close}
        priv={priv}
        handleChange={this.handleChange}
        updateAddress={this.updateAddress}
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
