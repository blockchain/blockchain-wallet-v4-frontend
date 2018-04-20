import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'

import { Remote } from 'blockchain-wallet-v4/src'
import { generateSeed, initializeForm, switchToEtherOrBchModal, updateUnspent, updateEffectiveBalance, updateSelection } from './services'
import { getData } from './selectors'
import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  constructor (props) {
    super(props)
    this.seed = generateSeed()
    this.handleClickAddressToggler = this.handleClickAddressToggler.bind(this)
    this.handleClickFeeToggler = this.handleClickFeeToggler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.customFeeHandler = this.customFeeHandler.bind(this)
  }

  componentWillMount () {
    this.props.dataBitcoinActions.fetchFee()
    this.props.dataBitcoinActions.fetchUnspent(this.props.defaultAccountIndex)
  }

  componentWillReceiveProps (nextProps) {
    if (Remote.Success.is(nextProps.data)) {
      // We initialize the form if form is not initialized yet
      initializeForm(this.props, nextProps)
      // We open the RequestEther modal if coin equals 'ETH'
      switchToEtherOrBchModal(nextProps)
      // We fetch the unspent
      updateUnspent(this.props, nextProps)
      // update effective Balance
      updateEffectiveBalance(this.props, nextProps)
      // update selection
      updateSelection(this.props, nextProps, this.seed)
    }
  }

  customFeeHandler (fee) {
    this.props.formActions.change('sendBitcoin', 'fee', fee)
  }

  handleClickAddressToggler () {
    // We toggle the dropdown 'to' display
    this.props.updateUI({ addressSelectToggled: !this.props.ui.addressSelectToggled })
    // /!\ CAREFUL: We reset field 'to' or 'to2' to make sure we only have 1 of those fields filled at a time.
    this.props.formActions.change('sendBitcoin', 'to', '')
    this.props.formActions.change('sendBitcoin', 'to2', '')
  }

  handleClickFeeToggler () {
    this.props.formActions.change('sendBitcoin', 'fee', this.props.data.data.initialValues.fee)
    this.props.updateUI({ feeEditToggled: !this.props.ui.feeEditToggled })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { data, ui } = this.props

    return data.cata({
      Success: (value) => <Success
        effectiveBalance={value.effectiveBalanceScaled}
        addressSelectToggled={ui.addressSelectToggled}
        addressSelectOpened={ui.addressSelectOpened}
        feeEditToggled={ui.feeEditToggled}
        handleSubmit={this.handleSubmit}
        handleClickAddressToggler={this.handleClickAddressToggler}
        handleClickFeeToggler={this.handleClickFeeToggler}
        fee={data.data.fee}
        totalFee={data.data.selection.fee}
        regularFeeHandler={this.regularFeeHandler}
        fees={data.data.fees}
        customFeeHandler={this.customFeeHandler}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  defaultAccountIndex: selectors.core.wallet.getDefaultAccountIndex(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { feeEditToggled: false, addressSelectToggled: false, addressSelectOpened: false } })
)

export default enhance(FirstStep)
