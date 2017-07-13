import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { wizardForm } from 'components/providers/FormProvider'
import { actions } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class RequestBitcoinContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit () {
    console.log('submit')
  }

  render () {
    const { step, ...rest } = this.props
    console.log(step, rest)
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

  return {
    address: selector(state, 'address'),
    amount: selector(state, 'amount'),
    message: selector(state, 'message'),
    nextAddress: '1BxGpZ4JDmfncucQkKi4gB77hXcq7aFhve'
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
