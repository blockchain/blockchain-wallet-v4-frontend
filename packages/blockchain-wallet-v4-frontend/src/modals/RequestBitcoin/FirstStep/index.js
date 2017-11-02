import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import settings from 'config'
import { actions, selectors } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickQRCode = this.handleClickQRCode.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('requestBitcoin', this.props.initialValues)
  }

  componentWillReceiveProps (nextProps) {
    const { coin } = nextProps
    // Replace the bitcoin modal to the ethereum modal
    if (coin === 'ETH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestEther')
    }
  }

  handleClickQRCode () {
    this.props.modalActions.showModal('QRCode', { address: this.props.receiveAddress })
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    return <FirstStep {...this.props} handleClickQRCode={this.handleClickQRCode} onSubmit={this.onSubmit} />
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
  const initialValues = {
    coin: 'BTC',
    to: {
      xpub: selectors.core.wallet.getDefaultAccountXpub(state),
      index: selectors.core.wallet.getDefaultAccountIndex(state)
    }
  }
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const receiveAddress = extractAddress(to || initialValues.to, getReceive)

  return {
    initialValues,
    receiveAddress,
    coin: formValueSelector('requestBitcoin')(state, 'coin')
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
