import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'
import * as crypto from 'crypto'
import { equals, isNil, lift, path, prop } from 'ramda'

import { getInitialValues, getData } from './selectors'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const shouldInitializeForm = (prevProps, nextProps) => {
  const predicate = prevData => isNil(path(['coin'], prevData))

  // isNil(path(['initialValues'], prevData)) &&
  // !isNil(path(['initialValues'], nextData))
  // We initialize the form if form is not initialized yet
  lift(predicate)(prevProps.data).map(success => {
    if (success) {
      console.log('nextProps', nextProps)
      nextProps.formActions.initialize('sendBitcoin', nextProps.initialValues)
    }
  })
}

const shouldSwitchToEtherModal = (prevProps, nextProps) => {
  // We open the RequestEther modal if coin equals 'ETH'
  const predicate = (prevData, nextData) =>
    !equals(prop('coin', prevData), prop('coin', nextData)) &&
    equals(prop('coin', nextData), 'ETH')

  lift(predicate)(prevProps.data, nextProps.data).map(success => {
    if (success) {
      nextProps.modalActions.closeAllModals()
      nextProps.modalActions.showModal('RequestEther')
    }
  })
}

class FirstStep extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.seed = crypto.randomBytes(16).toString('hex')
    this.handleClickAddressToggler = this.handleClickAddressToggler.bind(this)
    this.handleClickFeeToggler = this.handleClickFeeToggler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.bitcoinDataActions.fetchFee()
  }

  componentWillReceiveProps (nextProps) {
    // shouldInitializeForm(this.props, nextProps)
    shouldSwitchToEtherModal(this.props, nextProps)

    // nextProps.data.map(x => {
    //   // We initialize the form if needed
    //   if (!x.coin && !x.fee && !x.from) {
    //     this.props.formActions.initialize('sendBitcoin', x.initialValues)
    //   }
    // })

    // const { coin, fee, from, to, to2, amount, feeValues, coins } = nextProps

    // Replace the bitcoin modal to the ethereum modal
    // if (!equals(this.props.coin, nextProps.coin) && nextProps.coin === 'ETH') { this.props.sendEtherActions.initSendEther() }

    // // Update 'fee' if new value is fetched
    // if (!equals(this.props.feeValues, feeValues)) { this.props.formActions.change('sendBitcoin', 'fee', feeValues.regular) }

    // // Update 'coins' if 'from' has been updated
    // if (!equals(this.props.formValues.from, nextProps.formValues.from)) { this.props.sendBitcoinActions.getUnspent(from) }

    // // Update effective balance if fee or from (coins) has changed
    // if (!equals(this.props.fee, fee) || !equals(this.props.coins, coins)) { this.props.sendBitcoinActions.getEffectiveBalance({ fee }) }

    // // // Refresh the selection if fee, targetCoin, coins or fromAddress have been updated
    // if (from && (to || to2) && amount && fee &&
    //   (!equals(this.props.from, from) || !equals(this.props.to, to) || !equals(this.props.to2, to2) ||
    //   !equals(this.props.amount, amount) || !equals(this.props.fee, fee))) {
    //   if (this.timeout) { clearTimeout(this.timeout) }
    //   this.timeout = setTimeout(() => {
    //     this.props.sendBitcoinActions.getSelection({ from, to, to2, amount, fee, seed: this.seed })
    //   }, 1000)
    // }
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

  handleSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
  //   const { ui, selection, unit, coins, effectiveBalance } = this.props
  //   const convertedEffectiveBalance = Exchange.convertBitcoinToBitcoin({ value: effectiveBalance || 0, fromUnit: 'SAT', toUnit: unit }).value

  //   return <Success
  //     coins={coins}
  //     effectiveBalance={convertedEffectiveBalance}
  //     selection={selection}
  //     addressSelectToggled={ui.addressSelectToggled}
  //     addressSelectOpened={ui.addressSelectOpened}
  //     feeEditToggled={ui.feeEditToggled}
  //     handleClickAddressToggler={this.handleClickAddressToggler}
  //     handleClickFeeToggler={this.handleClickFeeToggler}
  //     onSubmit={this.onSubmit}
  //   />
    const { data, ui } = this.props
    console.log('render', data)

    return data.cata({
      Success: (value) => <Success
        addressSelectToggled={ui.addressSelectToggled}
        addressSelectOpened={ui.addressSelectOpened}
        feeEditToggled={ui.feeEditToggled}
        handleSubmit={this.handleSubmit}
        handleClickAddressToggler={this.handleClickAddressToggler}
        handleClickFeeToggler={this.handleClickFeeToggler}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  // initialValues: {
  //   coin: 'BTC',
  //   from: {
  //     xpub: selectors.core.wallet.getDefaultAccountXpub(state),
  //     index: selectors.core.wallet.getDefaultAccountIndex(state)
  //   }
  // },
  // coin: formValueSelector('sendBitcoin')(state, 'coin'),
  // from: formValueSelector('sendBitcoin')(state, 'from'),
  // to: formValueSelector('sendBitcoin')(state, 'to'),
  // to2: formValueSelector('sendBitcoin')(state, 'to2'),
  // amount: formValueSelector('sendBitcoin')(state, 'amount'),
  // message: formValueSelector('sendBitcoin')(state, 'message'),
  // fee: formValueSelector('sendBitcoin')(state, 'fee'),
  // selection: selectors.core.data.bitcoin.getSelection(state),
  // feeValues: selectors.core.data.bitcoin.getFee(state),
  // effectiveBalance: selectors.core.data.bitcoin.getEffectiveBalance(state),
  // coins: selectors.core.data.bitcoin.getCoins(state),
  // unit: selectors.core.settings.getBtcUnit(state)
  return {
    initialValues: getInitialValues(state),
    data: getData(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  bitcoinDataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { feeEditToggled: false, addressSelectToggled: false, addressSelectOpened: false } })
)

export default enhance(FirstStep)
