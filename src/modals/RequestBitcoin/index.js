import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { wizardForm } from 'components/providers/FormProvider'
import { actions } from 'data'
import Modal from 'components/generic/Modal'
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
    const { step, show, ...rest } = this.props

    switch (step) {
      case 1:
        return (
          <Modal icon='icon-receive' title='Request created' size='large' show={show}>
            <SecondStep {...rest} />
          </Modal>
        )
      default:
        return (
          <Modal icon='icon-receive' title='Request' size='large' show={show}>
            <FirstStep {...rest} />
          </Modal>
        )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('requestBitcoin')

  return {
    address: selector(state, 'address'),
    amount: selector(state, 'amount'),
    info: selector(state, 'info'),
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
