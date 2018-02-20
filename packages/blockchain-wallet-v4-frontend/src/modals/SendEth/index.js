import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import SendEth from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendEthContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('sendEth')
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <SendEth position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </SendEth>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(undefined, mapDispatchToProps),
  modalEnhancer('SendEth'),
  wizardProvider('sendEth', 2)
)

export default enhance(SendEthContainer)
