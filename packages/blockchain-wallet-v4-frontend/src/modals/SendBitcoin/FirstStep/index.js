import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import { equals } from 'ramda'
import * as crypto from 'crypto'

import { Exchange } from 'blockchain-wallet-v4/src'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleClickAddressToggler = this.handleClickAddressToggler.bind(this)
    this.handleClickFeeToggler = this.handleClickFeeToggler.bind(this)
    this.handleClickQrCodeCapture = this.handleClickQrCodeCapture.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('sendBitcoin', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { coin, fee, from, to, to2, amount, feeValues, coins } = nextProps

    // Replace the bitcoin modal to the ethereum modal
    if (!equals(this.props.coin, coin) && coin === 'ETH') { this.props.paymentActions.initSendEther() }

    // Update 'fee' if new value is fetched
    if (!equals(this.props.feeValues, feeValues)) { this.props.formActions.change('sendBitcoin', 'fee', feeValues.regular) }

    // Update 'coins' if 'from' has been updated
    if (!equals(this.props.from, from)) { this.props.paymentActions.getUnspent(from) }

    // Update effective balance if fee or from (coins) has changed
    if (!equals(this.props.fee, fee) || !equals(this.props.coins, coins)) { this.props.paymentActions.getEffectiveBalance({ fee }) }

    // // Refresh the selection if fee, targetCoin, coins or fromAddress have been updated
    if (from && (to || to2) && amount && fee &&
      (!equals(this.props.from, from) || !equals(this.props.to, to) || !equals(this.props.to2, to2) ||
      !equals(this.props.amount, amount) || !equals(this.props.fee, fee))) {
      if (this.timeout) { clearTimeout(this.timeout) }
      this.timeout = setTimeout(() => {
        this.props.paymentActions.getSelection({ from, to, to2, amount, fee, seed: this.seed })
      }, 1000)
    }
  }

  handleClickAddressToggler () {
    // We toggle the dropdown 'to' display
    this.props.updateUI({ addressSelectToggled: !this.props.ui.addressSelectToggled })
    // /!\ CAREFUL: We reset field 'to' or 'to2' to make sure we only have 1 of those fields filled at a time.
    this.props.formActions.change('sendBitcoin', 'to', '')
    this.props.formActions.change('sendBitcoin', 'to2', '')
  }

  handleClickFeeToggler () {
    this.props.updateUI({ feeEditToggled: !this.props.ui.feeEditToggled })
  }

  handleClickQrCodeCapture () {
    this.props.modalActions.showModal('QRCodeCapture')
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { ui, position, total, loading, closeAll, selection, unit, coins, effectiveBalance } = this.props
    const convertedEffectiveBalance = Exchange.convertBitcoinToBitcoin({ value: effectiveBalance || 0, fromUnit: 'SAT', toUnit: unit }).value

    return <FirstStep
      position={position}
      total={total}
      closeAll={closeAll}
      loading={loading}
      coins={coins}
      effectiveBalance={convertedEffectiveBalance}
      selection={selection}
      addressSelectToggled={ui.addressSelectToggled}
      addressSelectOpened={ui.addressSelectOpened}
      feeEditToggled={ui.feeEditToggled}
      handleClickAddressToggler={this.handleClickAddressToggler}
      handleClickFeeToggler={this.handleClickFeeToggler}
      handleClickQrCodeCapture={this.handleClickQrCodeCapture}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    coin: 'BTC',
    from: {
      xpub: selectors.core.wallet.getDefaultAccountXpub(state),
      index: selectors.core.wallet.getDefaultAccountIndex(state)
    }
  },
  coin: formValueSelector('sendBitcoin')(state, 'coin'),
  from: formValueSelector('sendBitcoin')(state, 'from'),
  to: formValueSelector('sendBitcoin')(state, 'to'),
  to2: formValueSelector('sendBitcoin')(state, 'to2'),
  amount: formValueSelector('sendBitcoin')(state, 'amount'),
  message: formValueSelector('sendBitcoin')(state, 'message'),
  fee: formValueSelector('sendBitcoin')(state, 'fee'),
  selection: selectors.core.data.bitcoin.getSelection(state),
  feeValues: selectors.core.data.bitcoin.getFee(state),
  effectiveBalance: selectors.core.data.bitcoin.getEffectiveBalance(state),
  coins: selectors.core.data.bitcoin.getCoins(state),
  unit: selectors.core.settings.getBtcUnit(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { feeEditToggled: false, addressSelectToggled: false, addressSelectOpened: false } })
)

export default enhance(FirstStepContainer)
