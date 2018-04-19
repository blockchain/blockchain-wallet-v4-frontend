import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import wizardProvider from 'providers/WizardProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import SendBch from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendBchContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('sendBch')
  }

  render () {
    const { step, position, total, closeAll, ...rest } = this.props

    return (
      <SendBch position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep {...rest} />}
        {step === 2 && <SecondStep {...rest} />}
      </SendBch>
    )
  }
}

SendBchContainer.propTypes = {
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(undefined, mapDispatchToProps),
  modalEnhancer('SendBch'),
  wizardProvider('sendBch', 2)
)

export default enhance(SendBchContainer)
