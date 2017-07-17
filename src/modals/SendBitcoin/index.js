import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { wizardForm } from 'components/providers/FormProvider'
import { actions } from 'data'
import FirstStep from './FirstStep'

class SendBitcoinContainer extends React.Component {
  render () {
    const { step, ...rest } = this.props

    switch (step) {
      default:
        return <FirstStep {...rest} />
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('sendBitcoin')

  return {
    from: selector(state, 'from'),
    to: selector(state, 'to'),
    amount: selector(state, 'amount'),
    message: selector(state, 'message')
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

const enhance = compose(
  wizardForm('sendBitcoin', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SendBitcoinContainer)
