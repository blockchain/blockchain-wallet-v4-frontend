import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { isEmpty, gte } from 'ramda'

import { Coin } from 'dream-wallet/lib'
import { convertFromUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      feeEditDisplayed: false,
      addressesSelectDisplayed: false,
      effectiveBalance: 0
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

  componentWillUpdate (nextProps) {
    const { invalid, fee, target, coins } = nextProps
    console.log(invalid, fee, target, coins)

    if (!invalid && gte(fee, 0) && target && coins) {
      console.log({fee, target, coins})
      // this.props.paymentActions.refreshPayment({fee, target, coins})
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

const mapStateToProps = (state, ownProps) => {
  const network = 'bitcoin'
  const unit = selectors.core.settings.getBtcCurrency(state)
  const address = ownProps.to
    ? ownProps.to.address
      ? ownProps.to.address
      : selectors.core.common.getNextAvailableReceiveAddress(undefined, ownProps.to.index, state)
    : undefined
  const satoshis = convertFromUnit(network, ownProps.amount, unit).getOrElse({ amount: undefined, symbol: 'N/A' })
  const target = address && gte(satoshis.amount, 0) ? Coin.fromJS({ address, value: satoshis.amount }) : undefined
  const coins = selectors.core.payment.getCoins(state)
  console.log(coins)
  return {
    feeValues: selectors.core.fee.getFee(state),
    coins,
    target
  }
}

const mapDispatchToProps = (dispatch) => ({
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  alertActions: bindActionCreators(actions.alerts, dispatch),
  feeActions: bindActionCreators(actions.core.fee, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
