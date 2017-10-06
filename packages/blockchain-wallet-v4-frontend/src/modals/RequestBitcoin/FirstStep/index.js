import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'

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
    this.props.reduxFormActions.initialize('requestBitcoin', this.props.initialValues)
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
    to: {
      xpub: selectors.core.wallet.getDefaultAccountXpub(state),
      index: selectors.core.wallet.getDefaultAccountIndex(state)
    }
  }
  const to = formValueSelector('requestBitcoin')(state, 'to')
  const receiveAddress = extractAddress(to || initialValues.to, getReceive)

  return {
    initialValues,
    receiveAddress
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
