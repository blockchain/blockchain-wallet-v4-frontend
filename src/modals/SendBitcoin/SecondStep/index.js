import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { is } from 'ramda'
import { push } from 'connected-react-router'

import { convertFromUnit } from 'services/ConversionService'
import { actions, selectors } from 'data'
import SecondStep from './template.js'
import settings from 'config'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleConfirmSecondPassword = this.handleConfirmSecondPassword.bind(this)
    this.handleSignAndPublish = this.handleSignAndPublish.bind(this)
  }

  handleSignAndPublish () {
    // We sign the transactions
    // this.props.paymentActions.signAndPublish(settings.NETWORK, this.props.selection)

    // TODO : IF SUCCESSFULL
    // We close the modal
    this.props.modalActions.closeModal()
    // We redirect to transactions
    this.props.routerActions.push('/transactions')
    // We display a notification
    this.props.alertActions.displaySuccess('Transaction confirmed !')
  }

  handleConfirmSecondPassword (secondPassword) {
    // TODO
    // If SecondPassword is valid
    console.log(secondPassword)
    this.handleSignAndPublish()
  }

  handleClick () {
    // TODO
    // If SecondPassword enabled:
    this.props.modalActions.showModalSecondPassword(this.handleConfirmSecondPassword)
    // Else
    // this.handleSignAndPublish()
  }

  render () {
    return <SecondStep {...this.props} handleClick={this.handleClick} />
  }
}

const selectAddress = (addressValue, selectorFunction) => {
  if (is(String, addressValue)) {
    return addressValue
  } else {
    return addressValue
      ? addressValue.address
        ? addressValue.address
        : selectorFunction(addressValue.index)
      : undefined
  }
}

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const getChange = index => selectors.core.common.getNextAvailableChangeAddress(settings.NETWORK, index, state)

  return {
    fromAddress: selectAddress(ownProps.from, getChange),
    toAddress: selectAddress(ownProps.to, getReceive),
    satoshis: convertFromUnit(ownProps.network, ownProps.amount, ownProps.unit).getOrElse({ amount: undefined, symbol: 'N/A' }).amount
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  paymentActions: bindActionCreators(actions.core.payment, dispatch),
  routerActions: bindActionCreators({ push }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
