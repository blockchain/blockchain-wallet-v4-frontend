import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, prop } from 'ramda'

import { actions } from 'data'
import { getData, getInitialValues, getImportedAddresses } from './selectors'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { Remote } from 'blockchain-wallet-v4/src'

class FirstStepContainer extends React.PureComponent {
  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    this.props.data.map(x => {
      if (equals(prop('coin', x), 'ETH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestEth', {
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'BCH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestBch', {
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'XLM')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestXlm', {
          lockboxIndex: this.props.lockboxIndex
        })
      }
    })
    if (
      !Remote.Success.is(prevProps.initialValues) &&
      Remote.Success.is(this.props.initialValues)
    ) {
      this.init()
    }
  }

  init = () => {
    this.props.initialValues.map(x => {
      this.props.formActions.initialize('requestBitcoin', x)
    })
  }

  handleClickQRCode = value => {
    this.props.modalActions.showModal('QRCode', { value })
  }

  handleOpenLockbox = () => {
    this.props.requestBtcActions.openLockboxAppClicked()
  }

  handleSubmit = e => {
    e.preventDefault()
    const {
      accountIdx,
      addressIdx,
      message,
      receiveAddress
    } = this.props.data.getOrElse({})
    this.props.requestBtcActions.firstStepSubmitClicked({
      accountIdx,
      addressIdx,
      message
    })
    this.props.setReceiveAddress(receiveAddress)
    this.props.nextStep()
  }

  handleRefresh = () => {
    const { btcDataActions, initialValues } = this.props
    if (!Remote.Success.is(initialValues)) return btcDataActions.fetchData()

    this.init()
  }

  render () {
    const { data, importedAddresses } = this.props

    return data.cata({
      Success: value => (
        <Success
          type={value.type}
          message={value.message}
          addressIdx={value.addressIdx}
          accountIdx={value.accountIdx}
          receiveAddress={value.receiveAddress}
          handleOpenLockbox={this.handleOpenLockbox}
          handleClickQRCode={() => this.handleClickQRCode(value)}
          handleSubmit={this.handleSubmit}
          importedAddresses={importedAddresses}
          excludeLockbox={value.excludeLockbox}
        />
      ),
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: getInitialValues(state, ownProps),
  data: getData(state),
  importedAddresses: getImportedAddresses(state)
})

const mapDispatchToProps = dispatch => ({
  requestBtcActions: bindActionCreators(
    actions.components.requestBtc,
    dispatch
  ),
  btcDataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStepContainer)
