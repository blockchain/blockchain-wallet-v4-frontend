import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'
import { equals } from 'ramda'
import { convertSatoshisToUnit } from 'services/ConversionService'
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
    const { coin, fee, coins } = nextProps
    // Replace the bitcoin modal to the ethereum modal
    if (!equals(this.props.coin, coin) && coin === 'BTC') { this.props.paymentActions.initSendBitcoin() }

    // Update effective balance if fee or from (coins) has changed
    // if (!equals(this.props.fee, fee) || !equals(this.props.coins, coins)) {
    //   this.props.paymentActions.getEffectiveBalance({ fee })
    // }
  }

  handleClickQrCodeCapture () {
    this.props.modalActions.showModal('QRCodeCapture')
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { position, total, closeAll, selection, unit, effectiveBalance } = this.props
    const convertedEffectiveBalance = convertSatoshisToUnit(effectiveBalance, unit).value

    return <FirstStep
      position={position}
      total={total}
      closeAll={closeAll}
      selection={selection}
      effectiveBalance={convertedEffectiveBalance}
      handleClickQrCodeCapture={this.handleClickQrCodeCapture}
      onSubmit={this.onSubmit}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: {
      coin: 'ETH',
      fee: 100 // selectors.core.data.ethereum.getFeeRegular(state)
    },
    coin: formValueSelector('sendEthereum')(state, 'coin'),
    to: formValueSelector('sendEthereum')(state, 'to'),
    amount: formValueSelector('sendEthereum')(state, 'amount'),
    message: formValueSelector('sendEthereum')(state, 'message'),
    fee: 0.000441,
    effectiveBalance: 100, //selectors.core.data.ethereum.getEffectiveBalance(state),
    unit: selectors.core.settings.getBtcUnit(state)
  }
}

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
