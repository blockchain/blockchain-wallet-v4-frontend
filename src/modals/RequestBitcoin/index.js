import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { wizardForm } from 'components/providers/FormProvider'
import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBitcoinContainer extends React.Component {
  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 1:
        return <SecondStep {...rest} />
      default:
        return <FirstStep {...rest} />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('requestBitcoin')
  const defaultSource = {
    xpub: selectors.core.wallet.getDefaultAccountXpub(state),
    index: selectors.core.wallet.getDefaultAccountIndex(state)
  }
  const source = selector(state, 'source')
  const selectedSource = source || defaultSource
  const nextAddress = selectedSource.address
    ? selectedSource.address
    : selectors.core.common.getNextAvailableReceiveAddress(undefined, selectedSource.index, state)

  return {
    nextAddress,
    selectedSource
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

const enhance = compose(
  wizardForm('requestBitcoin', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RequestBitcoinContainer)
