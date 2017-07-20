import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'

import { wizardForm } from 'components/providers/FormProvider'
import { actions, selectors } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBitcoinContainer extends React.Component {
  componentWillMount () {
    this.props.reduxFormActions.change('requestBitcoin', 'source', this.props.defaultSource)
  }

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
  const defaultSource = {
    xpub: selectors.core.wallet.getDefaultAccountXpub(state),
    index: selectors.core.wallet.getDefaultAccountIndex(state)
  }
  const selector = formValueSelector('requestBitcoin')
  const source = selector(state, 'source') || defaultSource
  const nextAddress = source.address
    ? source.address
    : selectors.core.common.getNextAvailableReceiveAddress(undefined, source.index, state)

  return {
    defaultSource,
    nextAddress
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
