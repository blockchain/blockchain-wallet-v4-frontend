import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, selectors } from 'data'
import SendBch from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendBchContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    const { step, position, total, closeAll } = this.props

    return (
      <SendBch position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
      </SendBch>
    )
  }
}

SendBchContainer.propTypes = {
  step: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.sendBch.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBch, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('SendBch')
)

export default enhance(SendBchContainer)
