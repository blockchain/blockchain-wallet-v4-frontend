import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import ui from 'redux-ui'

import { Remote } from 'blockchain-wallet-v4/src'
import { generateSeed, initializeForm, switchToEtherOrBitcoinModal, updateUnspent, updateEffectiveBalance, updateSelection } from './services'
import { getData } from './selectors'
import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStep extends React.PureComponent {
  constructor (props) {
    super(props)
    // this.timeout = undefined
    this.seed = generateSeed()
    this.handleClickAddressToggler = this.handleClickAddressToggler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.dataBchActions.fetchFee()
    this.props.dataBchActions.fetchUnspent(this.props.defaultAccountIndex)
  }

  componentWillReceiveProps (nextProps) {
    if (Remote.Success.is(nextProps.data)) {
      // We initialize the form if form is not initialized yet
      initializeForm(this.props, nextProps)
      // We open the RequestEther modal if coin equals 'ETH'
      switchToEtherOrBitcoinModal(nextProps)
      // We fetch the unspent
      updateUnspent(this.props, nextProps)
      // update effective Balance
      updateEffectiveBalance(this.props, nextProps)
      // update selection
      updateSelection(this.props, nextProps, this.seed)
    }
  }

  handleClickAddressToggler () {
    // We toggle the dropdown 'to' display
    this.props.updateUI({ addressSelectToggled: !this.props.ui.addressSelectToggled })
    // /!\ CAREFUL: We reset field 'to' or 'to2' to make sure we only have 1 of those fields filled at a time.
    this.props.formActions.change('sendBch', 'to', '')
    this.props.formActions.change('sendBch', 'to2', '')
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
        handleSubmit={this.handleSubmit}
        handleClickAddressToggler={this.handleClickAddressToggler}
        fee={data.data.fee}
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
  dataBchActions: bindActionCreators(actions.core.data.bch, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { feeEditToggled: false, addressSelectToggled: false, addressSelectOpened: false } })
)

export default enhance(FirstStep)
