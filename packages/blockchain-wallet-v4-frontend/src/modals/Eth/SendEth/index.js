import React from 'react'
import PropTypes from 'prop-types'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions, model, selectors } from 'data'
import SendEth from './template'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'

class SendEthContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.initialized()
  }

  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    const { step, position, total, closeAll } = this.props
    return (
      <SendEth position={position} total={total} closeAll={closeAll}>
        {step === 1 && <FirstStep />}
        {step === 2 && <SecondStep />}
      </SendEth>
    )
  }
}

SendEthContainer.propTypes = {
  step: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  closeAll: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  step: selectors.components.sendEth.getStep(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendEth, dispatch)
})

const enhance = compose(
  modalEnhancer(model.components.sendEth.MODAL),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SendEthContainer)
