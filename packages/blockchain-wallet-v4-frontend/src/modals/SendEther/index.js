import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import SendEther from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendEtherContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('sendEther')
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <SendEther position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </SendEther>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(undefined, mapDispatchToProps),
  modalEnhancer('SendEther'),
  wizardProvider('sendEther', 2)
)

export default enhance(SendEtherContainer)
