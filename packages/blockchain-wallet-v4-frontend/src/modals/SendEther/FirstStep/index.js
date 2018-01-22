import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { equals } from 'ramda'

import { transactions } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('sendEther', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { coin, feeRegular, gasLimit, fee } = nextProps
    // Replace the bitcoin modal to the ethereum modal
    if (!equals(this.props.coin, coin) && coin === 'BTC') { this.props.sendBitcoinActions.initSendBitcoin() }

    // Update fee when feeRegular or gasLimit change
    if (!equals(this.props.feeRegular, feeRegular) ||
        !equals(this.props.gasLimit, gasLimit) ||
        (feeRegular && gasLimit && !fee)
      ) {
      const fee = transactions.ethereum.calculateFee(feeRegular, gasLimit)
      this.props.formActions.change('sendEther', 'fee', fee)
    }
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { position, total, closeAll, loading, etherBalance, fee } = this.props
    const effectiveBalance = etherBalance - fee > 0 ? etherBalance - fee : 0

    return <FirstStep
      position={position}
      total={total}
      loading={loading}
      closeAll={closeAll}
      fee={fee}
      effectiveBalance={effectiveBalance}
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
  fee: formValueSelector('sendEther')(state, 'fee'),
  feeRegular: selectors.core.data.ethereum.getFeeRegular(state) || 0,
  gasLimit: selectors.core.data.ethereum.getGasLimit(state) || 0,
  etherBalance: selectors.core.data.ethereum.getBalance(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBitcoinActions: bindActionCreators(actions.modules.sendBitcoin, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
