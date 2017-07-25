import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { isEmpty, gte, is, equals, isNil } from 'ramda'
import * as crypto from 'crypto'

import { Coin } from 'dream-wallet/lib'
import { convertFromUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      feeEditDisplayed: false,
      addressesSelectDisplayed: false
    }

    this.handleClickAddressesFromSelect = this.handleClickAddressesFromSelect.bind(this)
    this.handleToggleAddressesToSelect = this.handleToggleAddressesToSelect.bind(this)
    this.handleClickFeeSelect = this.handleClickFeeSelect.bind(this)
    this.handleToggleFeeEdit = this.handleToggleFeeEdit.bind(this)
    this.handleToggleQrCodeCapture = this.handleToggleQrCodeCapture.bind(this)
    this.handleQrCodeScan = this.handleQrCodeScan.bind(this)
    this.handleQrCodeError = this.handleQrCodeError.bind(this)
    this.handleQrCodeBack = this.handleQrCodeBack.bind(this)
  }

  componentWillMount () {
    if (isEmpty(this.props.feeValues)) { this.props.feeActions.fetchFee() }
  }

  componentWillReceiveProps (nextProps) {
    const { invalid, fee, target, coins, changeAddress } = nextProps

    if (!invalid && gte(fee, 0) && target && coins && changeAddress && !equals(nextProps, this.props)) {
      const seed = crypto.randomBytes(16)
      this.props.paymentActions.refreshSelection(fee, target, coins, changeAddress, 'branchAndBound', seed.toString('hex'))
    }

    if (isNil(this.props.fee) && !equals(nextProps.defaultFeePerByte, this.props.defaultFeePerByte)) {
      this.props.reduxFormActions.change('sendBitcoin', 'fee', nextProps.defaultFeePerByte)
    }
  }

  componentWillUnmount () {
    this.props.feeActions.deleteFee()
  }

  handleClickAddressesFromSelect (value) {
    this.props.paymentActions.getUnspents(value)
  }

  handleToggleAddressesToSelect () {
    this.setState({ addressesSelectDisplayed: !this.state.addressesSelectDisplayed })
    if (this.state.addressesSelectDisplayed) { this.props.reduxFormActions.change('sendBitcoin', 'to', '') }
  }

  handleToggleFeeEdit () {
    this.setState({ feeEditDisplayed: !this.state.feeEditDisplayed })
  }

  handleClickFeeSelect (value) {
    console.log(value)
  }

  handleToggleQrCodeCapture () {
    this.props.modalActions.showModalQRCodeCapture(this.handleQrCodeScan, this.handleQrCodeError, this.handleQrCodeBack)
  }

  handleQrCodeScan (data) {
    if (data) {
      this.props.alertActions.displaySuccess(data)
      this.props.reduxFormActions.change('sendBitcoin', 'to', data)
      this.props.modalActions.showModalSendBitcoin()
    }
  }

  handleQrCodeError (error) {
    this.props.alertActions.displayError(error)
  }

  handleQrCodeBack () {
    this.props.modalActions.showModalSendBitcoin()
  }

  render () {
    return (<FirstStep
      addressesSelectDisplayed={this.state.addressesSelectDisplayed}
      feeEditDisplayed={this.state.feeEditDisplayed}
      handleClickAddressesFromSelect={this.handleClickAddressesFromSelect}
      handleToggleAddressesToSelect={this.handleToggleAddressesToSelect}
      handleToggleFeeEdit={this.handleToggleFeeEdit}
      handleClickFeeSelect={this.handleClickFeeSelect}
      handleToggleQrCodeCapture={this.handleToggleQrCodeCapture}
      {...this.props}
    />)
  }
}

FirstStepContainer.defaultProps = {
  to: { address: undefined }
}

const selectAddress = (addressValue, selectorFunction) => {
  if (is(String, addressValue)) {
    return addressValue
  } else {
    return addressValue
      ? addressValue.address
        ? addressValue.address
        : selectorFunction(addressValue.index)
      : undefined
  }
}

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(undefined, index, state)
  const getChange = index => selectors.core.common.getNextAvailableChangeAddress(undefined, index, state)

  const network = 'bitcoin'
  const unit = selectors.core.settings.getBtcCurrency(state)
  const targetAddress = selectAddress(ownProps.to, getReceive)
  const satoshis = convertFromUnit(network, ownProps.amount, unit).getOrElse({ amount: undefined, symbol: 'N/A' })
  const target = targetAddress && gte(satoshis.amount, 0) ? Coin.fromJS({ address: targetAddress, value: satoshis.amount }) : undefined
  const coins = selectors.core.payment.getCoins(state)
  const selection = selectors.core.payment.getSelection(state)
  const changeAddress = selectAddress(ownProps.from, getChange)

  return {
    feeValues: selectors.core.fee.getFee(state),
    coins,
    target,
    selection,
    changeAddress
  }
}

const mapDispatchToProps = (dispatch) => ({
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  feeActions: bindActionCreators(actions.core.fee, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
