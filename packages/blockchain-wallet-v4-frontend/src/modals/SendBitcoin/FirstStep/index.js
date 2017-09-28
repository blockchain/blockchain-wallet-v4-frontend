import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { reduxForm, formValueSelector, actions as reduxFormActions } from 'redux-form'
import ui from 'redux-ui'
import { gte, equals } from 'ramda'
import * as crypto from 'crypto'
import { Coin, CoinSelection } from 'blockchain-wallet-v4/src'
import { convertSatoshisToUnit, convertUnitToSatoshis } from 'services/ConversionService'
import { actions, selectors } from 'data'
import FirstStep from './template.js'
import settings from 'config'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { effectiveBalance: 0, seed: crypto.randomBytes(16) }
    this.timeout = undefined
    this.handleClickAddressToggler = this.handleClickAddressToggler.bind(this)
    this.handleClickFeeToggler = this.handleClickFeeToggler.bind(this)
    this.handleClickQrCodeCapture = this.handleClickQrCodeCapture.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.reduxFormActions.initialize('sendBitcoin', this.props.initialValues)
    this.props.feeActions.fetchFee()
  }

  componentWillUnmount () {
    this.props.feeActions.deleteFee()
  }

  componentWillReceiveProps (nextProps) {
    const { unit, ...rest } = this.props
    const { fee, from, to, to2, amount, ...rest2 } = rest
    const { feeValues, targetCoin, coins, fromAddress } = rest2
    const { paymentActions, reduxFormActions } = rest
    // Update 'coins' if 'from' has been updated
    if (!equals(from, nextProps.from)) {
      paymentActions.getUnspents(nextProps.from)
    }

    // Update the feeValues if we receive new values
    if (nextProps.feeValues && !equals(feeValues, nextProps.feeValues)) {
      reduxFormActions.change('sendBitcoin', 'fee', nextProps.feeValues.regular)
    }

    // Refresh the selection if fee, targetCoin, coins or fromAddress have been updated
    if (nextProps.from && (nextProps.to || nextProps.to2) && nextProps.amount &&
        nextProps.fee && nextProps.targetCoin && nextProps.coins &&
        (!equals(from, nextProps.from) ||
        !equals(to, nextProps.to) ||
        !equals(to2, nextProps.to2) ||
        !equals(amount, nextProps.amount) ||
        !equals(fee, nextProps.fee))) {
      if (this.timeout) { clearTimeout(this.timeout) }
      this.timeout = setTimeout(() => {
        paymentActions.refreshSelection(nextProps.fee, nextProps.targetCoin, nextProps.coins, nextProps.fromAddress, 'singleRandomDraw', this.state.seed.toString('hex'))
      }, 1000)
    }

    // Update the effectiveBalance value if fee or coins have been updated
    if (nextProps.fee && nextProps.coins && (gte(nextProps.fee, 0)) && (!equals(coins, nextProps.coins) || !equals(fee, nextProps.fee))) {
      const satoshisEffectiveBalance = CoinSelection.effectiveBalance(nextProps.fee, nextProps.coins).value
      const effectiveBalance = convertSatoshisToUnit(satoshisEffectiveBalance, unit).value
      this.setState({ effectiveBalance })
    }
  }

  handleClickAddressToggler () {
    const { updateUI, ui, reduxFormActions } = this.props
    // We toggle the dropdown 'to' display
    updateUI({ addressSelectToggled: !ui.addressSelectToggled })
    // We reset fieldd 'to' or 'to2' to make sure we only have 1 of those fields filled at a time.
    reduxFormActions.change('sendBitcoin', 'to', '')
    reduxFormActions.change('sendBitcoin', 'to2', '')
  }

  handleClickFeeToggler () {
    const { updateUI, ui } = this.props
    // We toggle the fee display
    updateUI({ feeEditToggled: !ui.feeEditToggled })
  }

  handleClickQrCodeCapture () {
    const { modalActions } = this.props
    // We open the capture modal
    modalActions.showModal('QRCodeCapture')
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { ui, position, total, closeAll, selection } = this.props

    return <FirstStep
      position={position}
      total={total}
      closeAll={closeAll}
      selection={selection}
      addressSelectToggled={ui.addressSelectToggled}
      addressSelectOpened={ui.addressSelectOpened}
      feeEditToggled={ui.feeEditToggled}
      effectiveBalance={this.state.effectiveBalance}
      handleClickAddressToggler={this.handleClickAddressToggler}
      handleClickFeeToggler={this.handleClickFeeToggler}
      handleClickQrCodeCapture={this.handleClickQrCodeCapture}
      onSubmit={this.onSubmit}
    />
  }
}

const extractAddress = (value, selectorFunction) =>
  value
    ? value.address
      ? value.address
      : selectorFunction(value.index)
    : undefined

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const getChange = index => selectors.core.common.getNextAvailableChangeAddress(settings.NETWORK, index, state)

  const initialValues = {
    from: {
      xpub: selectors.core.wallet.getDefaultAccountXpub(state),
      index: selectors.core.wallet.getDefaultAccountIndex(state)
    }
  }
  const coins = selectors.core.payment.getCoins(state)
  const feeValues = selectors.core.fee.getFee(state)
  const selection = selectors.core.payment.getSelection(state)
  const unit = selectors.core.settings.getBtcCurrency(state)

  const from = formValueSelector('sendBitcoin')(state, 'from')
  const to = formValueSelector('sendBitcoin')(state, 'to')
  const to2 = formValueSelector('sendBitcoin')(state, 'to2')
  const amount = formValueSelector('sendBitcoin')(state, 'amount')
  const message = formValueSelector('sendBitcoin')(state, 'message')
  const fee = formValueSelector('sendBitcoin')(state, 'fee')

  const satoshis = convertUnitToSatoshis(amount, unit).value
  const fromAddress = extractAddress(from, getChange)
  const toAddress = ownProps.ui.addressSelectToggled ? extractAddress(to, getReceive) : to2
  const targetCoin = toAddress && gte(satoshis, 0) ? Coin.fromJS({ address: toAddress, value: satoshis }) : undefined

  return {
    initialValues,
    fromAddress,
    toAddress,
    targetCoin,
    fee,
    to,
    to2,
    from,
    amount,
    message,
    coins,
    feeValues,
    selection,
    unit
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  feeActions: bindActionCreators(actions.core.fee, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  reduxForm({ form: 'sendBitcoin', destroyOnUnmount: false }),
  ui({ state: { feeEditToggled: false, addressSelectToggled: false, addressSelectOpened: false } }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(FirstStepContainer)
