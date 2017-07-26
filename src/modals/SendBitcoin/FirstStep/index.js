import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { gte, is, equals, isNil } from 'ramda'
import * as crypto from 'crypto'

import { Coin, CoinSelection } from 'dream-wallet/lib'
import { convertToUnit, convertFromUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      feeEditDisplayed: false,
      addressesSelectDisplayed: false
    }

    this.handleToggleAddressesToSelect = this.handleToggleAddressesToSelect.bind(this)
    this.handleToggleFeeEdit = this.handleToggleFeeEdit.bind(this)
    this.handleToggleQrCodeCapture = this.handleToggleQrCodeCapture.bind(this)
    this.handleQrCodeScan = this.handleQrCodeScan.bind(this)
    this.handleQrCodeError = this.handleQrCodeError.bind(this)
    this.handleQrCodeBack = this.handleQrCodeBack.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    const { invalid, network, unit, fee, from, target, coins, changeAddress } = nextProps

    if (!invalid && gte(fee, 0) && target && coins && changeAddress && !equals(nextProps, this.props)) {
      const seed = crypto.randomBytes(16)
      this.props.paymentActions.refreshSelection(fee, target, coins, changeAddress, 'branchAndBound', seed.toString('hex'))
    }

    if (!isNil(from) && !equals(from, this.props.from)) {
      this.props.paymentActions.getUnspents(from)
    }

    if ((gte(fee, 0)) && (!equals(coins, this.props.coins) || !equals(fee, this.props.fee))) {
      const effectiveBalance = CoinSelection.effectiveBalance(fee, coins).value
      const effectiveBalanceTransformed = convertToUnit(network, effectiveBalance, unit).getOrElse({ amount: 0 })
      if (!equals(this.props.effectiveBalance, effectiveBalanceTransformed)) {
        this.props.reduxFormActions.change('sendBitcoin', 'effectiveBalance', effectiveBalanceTransformed.amount)
      }
    }
  }

  handleToggleAddressesToSelect () {
    this.setState({ addressesSelectDisplayed: !this.state.addressesSelectDisplayed })
    if (this.state.addressesSelectDisplayed) { this.props.reduxFormActions.change('sendBitcoin', 'to', '') }
  }

  handleToggleFeeEdit () {
    this.setState({ feeEditDisplayed: !this.state.feeEditDisplayed })
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
    return <FirstStep
      addressesSelectDisplayed={this.state.addressesSelectDisplayed}
      feeEditDisplayed={this.state.feeEditDisplayed}
      handleToggleAddressesToSelect={this.handleToggleAddressesToSelect}
      handleToggleFeeEdit={this.handleToggleFeeEdit}
      handleToggleQrCodeCapture={this.handleToggleQrCodeCapture}
      {...this.props}
    />
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
  const satoshis = convertFromUnit(network, ownProps.amount, unit).getOrElse({ amount: undefined, symbol: 'N/A' })
  const targetAddress = selectAddress(ownProps.to, getReceive)
  const target = targetAddress && gte(satoshis.amount, 0) ? Coin.fromJS({ address: targetAddress, value: satoshis.amount }) : undefined

  return {
    network,
    unit,
    changeAddress: selectAddress(ownProps.from, getChange),
    coins: selectors.core.payment.getCoins(state),
    feeValues: selectors.core.fee.getFee(state),
    selection: selectors.core.payment.getSelection(state),
    target
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  feeActions: bindActionCreators(actions.core.fee, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
