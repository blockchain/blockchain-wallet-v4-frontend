import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'

import { wizardForm } from 'components/providers/FormProvider'
import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import settings from 'config'

class RequestBitcoinContainer extends React.Component {
  componentWillMount () {
    this.props.reduxFormActions.initialize('requestBitcoin', this.props.initialValues)
  }

  render () {
    console.log('hiii')
    switch (this.props.step) {
      case 0: return <FirstStep {...this.props} />
      case 1: return <SecondStep {...this.props} />
      default: return <div />
    }
  }
}

const selectAddress = (addressValue, selectorFunction) => {
  return addressValue
    ? addressValue.address
      ? addressValue.address
      : selectorFunction(addressValue.index)
    : undefined
}

const mapStateToProps = (state, ownProps) => {
  const getReceive = index => selectors.core.common.getNextAvailableReceiveAddress(settings.NETWORK, index, state)
  const selector = formValueSelector('requestBitcoin')
  const initialTo = {
    xpub: selectors.core.wallet.getDefaultAccountXpub(state),
    index: selectors.core.wallet.getDefaultAccountIndex(state)
  }
  const initialValues = {
    to: initialTo,
    receiveAddress: selectAddress(initialTo, getReceive)
  }

  return {
    initialValues,
    network: 'bitcoin',
    unit: selectors.core.settings.getBtcCurrency(state),
    to: selector(state, 'to'),
    amount: selector(state, 'amount'),
    message: selector(state, 'message'),
    receiveAddress: selectAddress(selector(state, 'to'), getReceive)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  wizardForm('requestBitcoin', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RequestBitcoinContainer)
