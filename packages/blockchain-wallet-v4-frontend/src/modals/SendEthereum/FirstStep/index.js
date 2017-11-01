import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
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
    this.props.formActions.initialize('sendEthereum', this.props.initialValues)
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
    const { position, total, closeAll, amount, fee } = this.props
    const convertedFee = Exchange.convertBitcoinToBitcoin({ value: fee || 0, fromUnit: 'WEI', toUnit: 'ETH' }).value
    const effectiveBalance = amount - convertedFee

    return <FirstStep
      position={position}
      total={total}
      closeAll={closeAll}
      fee={fee}
      effectiveBalance={effectiveBalance}
      handleClickQrCodeCapture={this.handleClickQrCodeCapture}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: {
      coin: 'ETH'
    },
    coin: formValueSelector('sendEthereum')(state, 'coin'),
    to: formValueSelector('sendEthereum')(state, 'to'),
    amount: formValueSelector('sendEthereum')(state, 'amount'),
    message: formValueSelector('sendEthereum')(state, 'message'),
    fee: selectors.core.data.ethereum.getFeeRegular(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
