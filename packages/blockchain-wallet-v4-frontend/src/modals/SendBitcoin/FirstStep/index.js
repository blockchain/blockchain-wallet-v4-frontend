import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { reduxForm, formValueSelector, actions as reduxFormActions } from 'redux-form'
import ui from 'redux-ui'
import { equals } from 'ramda'
import * as crypto from 'crypto'
import { convertSatoshisToUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    console.log('constructor:', props.effectiveBalance)
    super(props)
    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleClickAddressToggler = this.handleClickAddressToggler.bind(this)
    this.handleClickFeeToggler = this.handleClickFeeToggler.bind(this)
    this.handleClickQrCodeCapture = this.handleClickQrCodeCapture.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.validAmount = this.validAmount.bind(this)
  }

  componentWillMount () {
    console.log('componentWillReceiveProps:', this.props.effectiveBalance)
    this.props.reduxFormActions.initialize('sendBitcoin', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps:', this.props.effectiveBalance, nextProps.effectiveBalance)
    const { fee, from, to, to2, amount } = nextProps
    // Update 'coins' if 'from' has been updated
    if (!equals(this.props.from, from)) {
      this.props.paymentActions.getUnspent(from)
    }

    // Update effective balance if fee or amount has changed
    if (!equals(this.props.from, from) || !equals(this.props.fee, fee)) {
      console.log('componentWillReceiveProps 2:', this.props.effectiveBalance, nextProps.effectiveBalance)
      this.props.paymentActions.getEffectiveBalance({ fee })
    }

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
    reduxFormActions.change('sendBitcoin', 'to', '')
    reduxFormActions.change('sendBitcoin', 'to2', '')
  }

  handleClickFeeToggler () {
    this.props.updateUI({ feeEditToggled: !this.props.ui.feeEditToggled })
  }

  handleClickQrCodeCapture () {
    this.props.modalActions.showModal('QRCodeCapture')
  }

  validAmount (value, allValues, props) {
    console.log('validationRule', props.effectiveBalance)
    return value <= props.convertedEffectiveBalance ? undefined : `Invalid amount. Available : ${props.effectiveBalance}`
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { ui, position, total, closeAll, selection, unit, effectiveBalance } = this.props
    const convertedEffectiveBalance = convertSatoshisToUnit(effectiveBalance, unit).value
    console.log('render:', this.props.effectiveBalance)

    return <FirstStep
      position={position}
      total={total}
      closeAll={closeAll}
      selection={selection}
      addressSelectToggled={ui.addressSelectToggled}
      addressSelectOpened={ui.addressSelectOpened}
      feeEditToggled={ui.feeEditToggled}
      effectiveBalance={convertedEffectiveBalance}
      validAmount={this.validAmount}
      handleClickAddressToggler={this.handleClickAddressToggler}
      handleClickFeeToggler={this.handleClickFeeToggler}
      handleClickQrCodeCapture={this.handleClickQrCodeCapture}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: {
      from: {
        xpub: selectors.core.wallet.getDefaultAccountXpub(state),
        index: selectors.core.wallet.getDefaultAccountIndex(state)
      },
      fee: selectors.core.fee.getRegular(state)
    },
    from: formValueSelector('sendBitcoin')(state, 'from'),
    to: formValueSelector('sendBitcoin')(state, 'to'),
    to2: formValueSelector('sendBitcoin')(state, 'to2'),
    amount: formValueSelector('sendBitcoin')(state, 'amount'),
    message: formValueSelector('sendBitcoin')(state, 'message'),
    fee: formValueSelector('sendBitcoin')(state, 'fee'),
    selection: selectors.core.payment.getSelection(state),
    feeValues: selectors.core.fee.getFee(state),
    effectiveBalance: selectors.core.payment.getEffectiveBalance(state),
    unit: selectors.core.settings.getBtcCurrency(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  feeActions: bindActionCreators(actions.core.fee, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.payment, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { feeEditToggled: false, addressSelectToggled: false, addressSelectOpened: false } })
)

export default enhance(FirstStepContainer)
