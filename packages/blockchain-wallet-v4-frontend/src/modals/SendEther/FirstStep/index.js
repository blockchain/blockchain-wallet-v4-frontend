import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import { Exchange, transactions } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.handleClickQrCodeCapture = this.handleClickQrCodeCapture.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('sendEther', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { coin } = nextProps
    // Replace the bitcoin modal to the ethereum modal
    if (!equals(this.props.coin, coin) && coin === 'BTC') { this.props.paymentActions.initSendBitcoin() }
  }

  handleClickQrCodeCapture () {
    this.props.modalActions.showModal('QRCodeCapture')
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { position, total, closeAll, loading, amount, feeRegular, gasLimit } = this.props
    const fee = transactions.ethereum.calculateFee(feeRegular, gasLimit)
    const convertedFee = Exchange.convertBitcoinToBitcoin({ value: fee, fromUnit: 'WEI', toUnit: 'ETH' }).value
    const effectiveBalance = amount - convertedFee

    return <FirstStep
      position={position}
      total={total}
      loading={loading}
      closeAll={closeAll}
      fee={fee}
      effectiveBalance={effectiveBalance}
      handleClickQrCodeCapture={this.handleClickQrCodeCapture}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    coin: 'ETH'
  },
  coin: formValueSelector('sendEther')(state, 'coin'),
  to: formValueSelector('sendEther')(state, 'to'),
  amount: formValueSelector('sendEther')(state, 'amount'),
  message: formValueSelector('sendEther')(state, 'message'),
  feeRegular: selectors.core.data.ethereum.getFeeRegular(state) || 0,
  gasLimit: selectors.core.data.ethereum.getGasLimit(state) || 0
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
